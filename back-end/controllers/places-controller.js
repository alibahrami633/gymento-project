// the controller focuses on middleware and business logics of the app
const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsFromAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

/* ========================================================= */
/* ====================== getPlaceById ===================== */
/* ========================================================= */
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    // finById is not async and does not return a promise. To convert it to a promise .exec() can be added
    place = await Place.findById(placeId); // returns a db object
  } catch (err) {
    // database error
    const error = new HttpError(
      "Something went wrong. Could not find the place.",
      500
    );
    return next(error);
  }

  if (!place) {
    // application side error
    const error = new HttpError(
      "Could not find any place with the provided place ID.",
      404
    );
    return next(error);
  }
  // toObject method converts the incoming db object into a normal js object => getters: true => we get the id without "_" as well.
  res.json({ place: place.toObject({ getters: true }) });
};

/* ========================================================= */
/* =================== getPlacesByUserId =================== */
/* ========================================================= */
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let places; // alternative way
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }

  // if(!place || places.length === 0) { // alternative way
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    // next is used for throwing errors in async functions - must be returned
    return next(
      new HttpError(
        "Could not find any places with the provided place ID.",
        404
      )
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ), // cannot use toObject directly with places because find method returns an array
  });
};

/* ========================================================= */
/* ====================== createPlace ====================== */
/* ========================================================= */
const createPlace = async (req, res, next) => {
  // checks into req to see if there are any validation errors we set in places-routes
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs, please check your data.", 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsFromAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpError("Could not find user by this id.", 404));
  }

  if (!user) {
    return next(new HttpError("Creating place failed, try again later.", 500));
  }

  try {
    // using session and transaction to make sure both adding new user transaction
    // and adding the places transacton to the newly created user gets done in a session
    // so if any of the transactions goes wrong, then all the transactions of that session rolls back
    // and reversed by mongoose
    const sess = await mongoose.startSession(); // adds a session
    sess.startTransaction(); // start a transaction
    await createdPlace.save({ session: sess }); // one transaction is executing
    user.places.push(createdPlace); // another transaction is executing
    await user.save({ session: sess }); // another transaction is executing
    await sess.commitTransaction(); // if all the transactions go well, then commit the whole session
  } catch (err) {
    const error = new HttpError("Creating place failed.", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

/* ========================================================= */
/* ====================== updatePlace ====================== */
/* ========================================================= */
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs, please check your data.", 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not update place.",
      500
    );
    return next(error);
  }

  // authorization: checks if the userId of the logged in client is equal to the userId passed into the request
  // here creator is _id which is a mongoose object and should be converted to a string
  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "Unauthorized access, not allowed to update the place.",
      401
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

/* ========================================================= */
/* ====================== deletePlace ====================== */
/* ========================================================= */
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not delete the place",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(new HttpError("Could not find place with this id.", 404));
  }

  // authorization: checks if the userId of the logged in client is equal to the userId passed into the request
  // here creator is an object because populate method returns an object and we can have access to its id property
  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "Unauthorized access, not allowed to delete the place.",
      401
    );
    return next(error);
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession(); // adds a session
    sess.startTransaction(); // start a transaction
    await place.remove({ session: sess }); // one transaction is executing
    place.creator.places.pull(place); // another transaction is executing => remove the place from the user (by id)
    await place.creator.save({ session: sess }); // another transaction is executing
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not delete the place",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Place was deleted." });
};

/* ========================================================= */
/* ======================== exports ======================== */
/* ========================================================= */
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

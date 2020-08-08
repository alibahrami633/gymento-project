// the controller focuses on middleware and business logics of the app
const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsFromAddress = require("../util/location");
const Place = require("../models/place");
const { use } = require("../routes/users-routes");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire Building",
    description: "A famout sky scraper...",
    location: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    address: "20 W 34th St, New York, NY 10001, United States",
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire Building II",
    description: "A famout sky scraper...",
    location: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    address: "20 W 34th St, New York, NY 10001, United States",
    creator: "u1",
  },
];

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

  let places;
  try {
    // find in mongoose returns an array whereas in mongoDB returns a cursor for further iteration
    places = await Place.find({ creator: userId }); // returns an array of db objects
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    // next is used for throwing errors in async functions - must be returned
    return next(
      new HttpError(
        "Could not find any places with the provided place ID.",
        404
      )
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })), // cannot use toObject directly with places because find method returns an array
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
    image: "https://media.timeout.com/images/105641738/1024/576/image.jpg",
    creator,
  });

  try {
    await createdPlace.save();
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
    throw new HttpError("Invalid inputs, please check your data.", 422);
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
const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find the ID", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
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

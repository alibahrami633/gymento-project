// the controller focuses on middleware and business logics of the app

const { uuid } = require("uuidv4");

const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    // for sync funtions - does not require return before it
    throw new HttpError(
      "Could not find any place with the provided place ID.",
      404
    );
  }

  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!places) {
    // next is used for throwing errors in async functions - must be returned
    return next(
      new HttpError("Could not find any place with the provided place ID.", 404)
    );
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }; // spread operator creates a copy of the old updatedPlace object to a new object
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace; // replaces the old object with with the new updatedPlace object - a better practice for updating an object

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

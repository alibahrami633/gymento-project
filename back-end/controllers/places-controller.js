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

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;

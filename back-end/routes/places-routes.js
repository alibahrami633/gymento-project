// middleware responsible for handling routes related to places
const express = require("express");

// validation library
const { check } = require("express-validator");

const PlacesControllers = require("../controllers/places-controller");

const router = express.Router();

router.get("/:pid", PlacesControllers.getPlaceById);

router.get("/user/:uid", PlacesControllers.getPlacesByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  PlacesControllers.createPlace
);

router.patch("/:pid", PlacesControllers.updatePlace);

router.delete("/:pid", PlacesControllers.deletePlace);

module.exports = router;

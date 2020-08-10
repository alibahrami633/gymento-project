// middleware responsible for handling routes related to places
const express = require("express");
const { check } = require("express-validator");

const PlacesControllers = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth.js");

const router = express.Router();

// GET requests are open to everyone
router.get("/:pid", PlacesControllers.getPlaceById);

router.get("/user/:uid", PlacesControllers.getPlacesByUserId);

// middleware for checking the token so if it is invalid the next lines (POST ones) will not be executed.
router.use(checkAuth); // registering checkAuth as a middleware

// POST requests are only open to authenticated users
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  PlacesControllers.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  PlacesControllers.updatePlace
);

router.delete("/:pid", PlacesControllers.deletePlace);

module.exports = router;

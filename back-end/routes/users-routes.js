// middleware responsible for handling routes related to users
const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controller");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(), // normalizeEmail change all upercases to lowercases and trims
    check("password").isLength({ min: 9 }),
  ],
  usersControllers.signUp
);

router.post("/login", usersControllers.login);

module.exports = router;

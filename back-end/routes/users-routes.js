// middleware responsible for handling routes related to users

const express = require("express");

const usersControllers = require("../controllers/users-controller");

const router = express.Router();

router.get("/");

router.post("/signup");

router.post("/login");

module.exports = router;

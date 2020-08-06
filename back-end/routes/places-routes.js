// middleware responsible for handling routes related to places

const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("GET Requests in places");
  res.json({ message: "it works!" });
});

module.exports = router;

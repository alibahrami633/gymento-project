const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes"); // a middleware

const app = express();

app.use("/api/places", placesRoutes);

// error handling middleware funciton (it will be called if any errors were thrown from other functions here)
app.use((error, req, res, next) => {
  // if a response has already be sent
  if (res.headerSent) {
    return next(error); // a response has already been sent so there is no need to send an error - go to next error
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

app.listen(5000);

const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes"); // a middleware
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json()); // parses any incoming request's body and extracts any json data and convert them to js objects and calls next which goes to the next line of code

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

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

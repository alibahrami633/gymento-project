const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes"); // a middleware
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json()); // parses any incoming request's body and extracts any json data and convert them to js objects and calls next which goes to the next line of code

app.use("/uploads/images", express.static(path.join("uploads", "images"))); // gives access to the uploads/images folder even if it is not in the public access

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allows any domains to send requests to the API "*" => it can be limitted to i.e "localhost"
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// error handling middleware funciton (it will be called if any errors were thrown from other functions here)
app.use((error, req, res, next) => {
  // if there is a file (fileUpload) set
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  // if a response has already be sent
  if (res.headerSent) {
    return next(error); // a response has already been sent so there is no need to send an error - go to next error
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.aall0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));

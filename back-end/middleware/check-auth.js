const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  // to handle the browser behavior of sending OPTION method instead of POST or other methods in the first place.
  // Browser sends OPTION to check if the API allows the request.
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // req.body is not a good choice because DELETE and GET methods do not have a body.
    // Query params (?token=abc...) are one choice and the other one is passing the token through headers which is cleaner
    const token = req.headers.authorization.split(" ")[1]; // Athorization: 'Bearer TOKEN' ==split==> 'Bearer' and 'TOKEN'
    if (!token) {
      throw new Error("Authentication failed.", 401);
    }
    const deccodedToken = jwt.verify(token, "7189937431_secret_ali");
    req.userData = { userId: deccodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed.", 401);
    return next(error);
  }
};

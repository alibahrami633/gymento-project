// the controller focuses on middleware and business logics of the app
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

/* ========================================================= */
/* ======================= getUsers ======================== */
/* ========================================================= */
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); // projection concept => return name and email but not password
  } catch (err) {
    return next(new HttpError("Fetching users failed, try again later.", 500));
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

/* ========================================================= */
/* ======================== signUp ========================= */
/* ========================================================= */
const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError("Invalid inputs, please check your data.", 422);
    return next(error);
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, try again later.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User already exists. You can try login.", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: "https://randomuser.me/api/portraits/lego/2.jpg",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed. Try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

/* ========================================================= */
/* ========================= login ========================= */
/* ========================================================= */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login failed, try again later.", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid credentials.", 401);
    return next(error);
  }

  res.json({
    message: "Logged in!",
    user: existingUser.toObject({ getters: true }),
  });
};

/* ========================================================= */
/* ======================== exports ======================== */
/* ========================================================= */
exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;

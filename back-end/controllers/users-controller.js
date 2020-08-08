// the controller focuses on middleware and business logics of the app

const { uuid } = require("uuidv4");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  { id: "u1", name: "Ali Bahrami", email: "a@b.com", password: "test" },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signUp = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    throw new HttpError("The email you entered already exists!", 422);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Could not identify the user, wrong credentials.", 401);
  }
  res.json("Logged in!");
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;

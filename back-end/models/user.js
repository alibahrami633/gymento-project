const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, requred: true },
  email: { type: String, requred: true, unique: true },
  password: { type: String, requred: true, minlength: 9 },
  image: { type: String, requred: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

userSchema.plugin(uniqueValidator); // validates the email its unique property

module.exports = mongoose.model("User", userSchema);

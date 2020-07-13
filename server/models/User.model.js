const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  city: {
    type: String
  },
  street: {
    type: String
  }
});

module.exports = mongoose.model("User", UserSchema);
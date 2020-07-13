const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let MessageSchema = new Schema({
  sender: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model("Message", MessageSchema);
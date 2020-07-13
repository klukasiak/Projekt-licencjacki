const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AuctionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    default: new Date()
  },
  endDate: {
    type: Date,
    required: true
  },
  buyNow: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Auction", AuctionSchema);
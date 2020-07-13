const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AuctionOfferSchema = new Schema({
  idOffer: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  offerValue: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model("AuctionOffer", AuctionOfferSchema);
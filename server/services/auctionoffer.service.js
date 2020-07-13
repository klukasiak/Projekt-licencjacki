const AuctionOffer = require("../models/AuctionOffer.model");

const saveAuctionOffer = (auctionOffer, res) => {
  auctionOffer.save((err, doc) => {
    if (err) {
      res.status(422).json(err);
    } else {
      res.json(doc);
    }
  });
};

module.exports.create = (req, res) => {
  let auctionOffer = new AuctionOffer(req.body);
  AuctionOffer.find({ idOffer: auctionOffer.idOffer })
    .sort({ offerValue: -1 })
    .limit(1)
    .exec((err, off) => {
      if (err) return err;
      else {
        if (off.offerValue >= auctionOffer.offerValue) {
          res.json({ message: "To low offer" });
        } else {
          saveAuctionOffer(auctionOffer, res);
        }
      }
    });
};

module.exports.list = (req, res, next) => {
  AuctionOffer.find({}, (err, auctionOffers) => {
    if (err) {
      next(err);
    } else {
      res.json(auctionOffers);
    }
  });
};

module.exports.read = (req, res, next) => {
  AuctionOffer.findById(req.params.id, (err, auctionOffer) => {
    if (err) next(err);
    else {
      if (auctionOffer) {
        res.json(auctionOffer);
      } else {
        res.status(404);
      }
    }
  });
};

module.exports.readByOffer = (req, res, next) => {
  AuctionOffer.find({ idOffer: req.params.id }, (err, auctionOffers) => {
    if (err) next(err);
    else {
      if (auctionOffers) {
        res.json(auctionOffers);
      } else {
        res.status(404);
      }
    }
  });
};

module.exports.readByUser = (req, res, next) => {
  AuctionOffer.find({ username: req.params.username }, (err, auctionOffers) => {
    if (err) next(err);
    else {
      if (auctionOffers) {
        res.json(auctionOffers);
      } else {
        res.status(404);
      }
    }
  });
};

module.exports.findTopValue = (req, res, next) => {
  AuctionOffer.find({ idOffer: req.params.id })
    .sort({ offerValue: -1 })
    .limit(1)
    .exec((err, auctionOffer) => {
      if (err) next(err);
      else {
        if (auctionOffer) {
          res.json(auctionOffer);
        } else {
          res.status(404);
        }
      }
    });
};
const Auction = require("../models/Auction.model");
const moment = require("moment");

const saveAuction = (auction, res) => {
  auction.save((err, doc) => {
    if (err) {
      res.status(404).json(err);
    } else if(moment(auction.startDate).isBefore(new Date())) {
      res.status(400).json({err: "Start date is before than now"});
    } else{
      res.json(doc);
    }
  });
};

module.exports.create = (req, res) => {
  let auction = new Auction(req.body);
  saveAuction(auction, res);
};

module.exports.list = (req, res, next) => {
  Auction.find({}, (err, auctions) => {
    if (err) {
      next(err);
    } else {
      res.json(auctions);
    }
  });
};

module.exports.read = (req, res, next) => {
  Auction.findById(req.params.id, (err, auction) => {
    if (err) next(err);
    else {
      if (auction) {
        res.json(auction);
      } else {
        res.status(404);
      }
    }
  });
};

module.exports.readByOwner = (req, res, next) => {
  Auction.find({ owner: req.params.owner }, (err, auction) => {
    if (err) next(err);
    else {
      if (auction) {
        res.json(auction);
      } else {
        res.status(404);
      }
    }
  });
};

module.exports.readByIdAndNotBuyNow = (req, res, next) => {
  Auction.find({ _id: req.params.id, endDate: { $gt: Date.now() } })
    .then(auctions => {
      if (!auctions) {
        next(null);
      } else {
        res.send(auctions);
      }
    })
    .catch(err => console.log(err));
};

module.exports.updateAuction = (req, res) => {
  Auction.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    owner: req.body.owner,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    buyNow: req.body.buyNow
  }, { new: true })
    .then(auction => {
      if (!auction) {
        return res.sendStatus(404);
      } else {
        return res.send(auction);
      }
    })
    .catch(err => console.log(err));
};

module.exports.pagination = (req, res, next) => {
  console.log(req.params.numpage);
  let page = parseInt(req.params.numpage);
  let limit = 5;
  Auction.find({ endDate: { $gt: Date.now() } })
    .sort({ endDate: 1 })
    .skip(page * limit)
    .limit(limit)
    .exec((err, auctions) => {
      if (err) {
        next(err);
      } else {
        Auction.countDocuments({ endDate: { $gt: Date.now() } }).exec((count_error, count) => {
          if (count_error) {
            next(count_error);
          } else {
            return res.json({
              total: count,
              page: page,
              auctions: auctions
            });
          }
        });
      }
    });
};
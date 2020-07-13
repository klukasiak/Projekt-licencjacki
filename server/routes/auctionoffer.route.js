const router = require("express").Router();
const services = require("../services/auctionoffer.service");
const isAuth = require("./auth.route").isAuth;

router.route("/api/auctionoffers")
  .get(services.list);

router.post("/api/auctionoffers", isAuth, services.create);

router.get("/api/auctionoffers/:id", services.read);

router.get("/api/auctionoffers/byOffer/:id", isAuth, services.readByOffer);

router.get("/api/auctionoffers/byUser/:username", isAuth, services.readByUser);

router.get("/api/auctionoffers/byOffer/top/:id", isAuth, services.findTopValue);

module.exports = router;
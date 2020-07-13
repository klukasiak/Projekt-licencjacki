const router = require("express").Router();
const services = require("../services/auction.service");
const isAuth = require("./auth.route").isAuth;

router.route("/api/auctions")
  .get(services.list)
  .post(services.create);

router.get("/api/auctions/:id", services.read);
router.get("/api/auctions/owner/:owner", isAuth, services.readByOwner);
router.get("/api/auctions/notbuy/:id", isAuth, services.readByIdAndNotBuyNow);
router.put("/api/auctions/:id", isAuth, services.updateAuction);
router.get("/api/auctions/page/:numpage", services.pagination);

module.exports = router;
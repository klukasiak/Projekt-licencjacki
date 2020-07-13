const router = require("express").Router();
const services = require("../services/message.service");
const isAuth = require("./auth.route").isAuth;

router.route("/api/messages")
  .get(services.list)
  .post(services.create);

router.get("/api/message/:id", isAuth, services.read);

router.get("/api/message/my/:username", isAuth, services.readMessages);

module.exports = router;
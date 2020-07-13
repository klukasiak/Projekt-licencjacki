const router = require("express").Router();
const services = require("../services/user.service");
const passport = require("passport");
const isAuth = require("./auth.route").isAuth;

// router.post("/login", passport.authenticate('local', { failureRedirect: "/login", successRedirect: "/home" }));
router.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).send([user, "Cannot log in", info]);
    }

    req.login(user, err => {
      res.send(user);
      console.log(err);
    });
  })(req, res, next);
});

router.get("/api/user", isAuth, (req, res) => {
  res.send(req.session.passport);
  console.log(req.session.passport);
});

router.get("/api/logout", isAuth, (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) throw err;
    res.clearCookie("connect.sid");
    req.session = null;
  });
});

router.post("/api/register", services.create);
router.get("/api/home", (req, res) => {
  res.sendStatus(200).send("OK");
});

router.get("/api/user/:id", isAuth, services.read);

module.exports = router;
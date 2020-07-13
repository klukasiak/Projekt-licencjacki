const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

const verifyCallback = (username, password, done) => {
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return done(null, false, { err: "This user is not registred." });
      }
      bcryptjs.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { err: "Password incorrect" });
        }
      });
    })
    .catch((err) => {
      done(err);
    });
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch(err => done(err));
});
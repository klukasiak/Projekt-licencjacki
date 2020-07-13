const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

const saveUser = (user, res) => {
  console.log(user);
  User.findOne({ username: user.username }).then(foundUser => {
    if (!foundUser) {
      bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(user.password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user.save()
            .then(res.status(201).json(user))
            .catch(err => console.log(err));
        });
      });
    } else {
      res.status(400).json({ message: "User already exist!" });
    }
  });
};

module.exports.findById = (user_id) => {
  User.findById(user_id, (err, user) => {
    if (err) return err;
    else return user;
  });
};

module.exports.create = (req, res) => {
  let user = new User(req.body);
  saveUser(user, res);
};

module.exports.read = (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      next(err);
    } else {
      if (user) {
        res.json(user);
      } else {
        res.sendStatus(404);
      }
    }
  });
};

module.exports.list = (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      next(err);
    } else {
      res.json(users);
    }
  });
};

module.exports.update = (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      next(err);
    } else {
      if (user) {
        user.username = req.body.username;
        user.password = req.body.password;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
      }
    }
  });
};

module.exports.delete = (req, res, next) => {
  User.findByIdAndRemove(req.params.id, err => {
    if (err) {
      return next(err);
    } else {
      res.sendStatus(204);
    }
  });
};
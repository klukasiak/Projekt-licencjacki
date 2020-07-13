const Message = require("../models/Message.model");

const saveMessage = (message, res) => {
  message.save((err, doc) => {
    if (err) {
      res.status(422).json(err);
    } else {
      res.json(doc);
    }
  });
};

module.exports.create = (req, res) => {
  let message = new Message(req.body);
  saveMessage(message, res);
};

module.exports.list = (req, res, next) => {
  Message.find({}, (err, message) => {
    if (err) {
      next(err);
    } else {
      res.json(message);
    }
  });
};

module.exports.read = (req, res, next) => {
  Message.findById(req.params.id, (err, message) => {
    if (err) next(err);
    else {
      if (message) {
        res.json(message);
      } else {
        res.status(404);
      }
    }
  });
};

module.exports.readMessages = (req, res, next) => {
  Message.find()
    .or([{ recipient: req.params.username }, { sender: req.params.username }])
    .then(messages => {
      if (!messages) {
        next(null);
      } else {
        res.json(messages);
      }
    })
    .catch(err => console.log(err));
};
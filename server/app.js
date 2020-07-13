const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const userRoutes = require("./routes/user.route");
const auctionRoutes = require("./routes/auction.route");
const messageRoutes = require("./routes/message.route");
const auctionOfferRoutes = require("./routes/auctionoffer.route");
const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};
const cookieParser = require("cookie-parser");
const app = express();
const https = require("https");
const fs = require("fs");

const key = fs.readFileSync("./certs/selfsigned.key");
const cert = fs.readFileSync("./certs/selfsigned.crt");
const options = {
  key: key,
  cert: cert
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/dist/"));

//db connection
mongoose.connect(process.env.DATABASE, opts).then(() => {

  let db = mongoose.connection;
  db.on("error", (err) => {
    console.error(`Problem z połączeniem: ${err}`);
  });

  //passport
  require("./config/passport");

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(userRoutes);
  app.use(auctionRoutes);
  app.use(messageRoutes);
  app.use(auctionOfferRoutes);
  app.get("*", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
  });
  app.use((_req, res) => {
    res.sendStatus(404);
  });

}).catch(err => {
  if (err) {
    console.error(`Błąd: ${err}`);
  }
});

//session
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection, collection: "sessions" });
const sessionKey = "express.sid";
app.use(session({
  key: sessionKey,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  unset: "destroy",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // Equals 1 day
  }
}));

//sockets
const server = https.createServer(options, app);
const passportSocketIo = require("passport.socketio");
const sio = require("socket.io")(server);
sio.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: sessionKey,
  secret: process.env.SECRET,
  store: sessionStore
}));

require("./sockets")(sio);

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
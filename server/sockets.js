const Message = require("./models/Message.model");
const Auction = require("./models/Auction.model");
const AuctionOffer = require("./models/AuctionOffer.model");

module.exports = (sio) => {
  sio.sockets.on("connection", socket => {
    console.log("connected");

    socket.on("privateChat", (data) => {
      console.log(`${data.sender} joined private chat with ${data.recipient}`);
      for (let i = 1; i < Object.keys(socket.rooms).length; i++) {
        socket.leave(socket.rooms[Object.keys(socket.rooms)[i]]);
      }
      socket.join([data.sender, data.recipient].sort().join(""));
    });

    socket.on("newMessage", (data) => {
      const message = new Message({
        recipient: data.recipient,
        sender: data.sender,
        text: data.text,
        date: new Date()
      });
      message.save()
        .then(result => {
          console.log(result);
          sio.sockets.in([result.sender, result.recipient].sort().join("")).emit("msg", result);
        })
        .catch(err => console.log(err));
    });

    socket.on("joinAuctions", data => {
      socket.join(data.idAuction, () => {
        console.log("User Joined to auctions");
      });
    });

    socket.on("joinAuction", data => {
      for (let i = 1; i < Object.keys(socket.rooms).length; i++) {
        socket.leave(socket.rooms[Object.keys(socket.rooms)[i]]);
      }
      socket.join(data.idAuction);
      console.log(`User connected to auction ${data.idAuction}`);
    });

    socket.on("newOffer", (data) => {
      Auction.findById(data.idAuction)
        .then(result => {
          console.log("auction finded");
          AuctionOffer.find({ idOffer: data.idAuction })
            .sort({ offerValue: -1 })
            .limit(1)
            .exec((err, offer) => {
              let newOffer = new AuctionOffer({
                idOffer: data.idAuction,
                username: data.username,
                offerValue: data.offerValue,
                date: new Date()
              });
              if (!err && offer) {
                console.log("Top finded");
                console.log(offer.offerValue);
                console.log(data.offerValue);
                if (parseInt(offer.offerValue < data.offerValue)) {
                  newOffer.save((err, of) => {
                    if (!err) {
                      sio.sockets.in(of.idOffer).emit("refOffer", of);
                    }
                  });
                } else {
                  newOffer.save((err, of) => {
                    if (!err) {
                      sio.sockets.in(of.idOffer).emit("refOffer", of);
                    }
                  });
                }
              } else {
                console.log("Top not finded");
                if (parseInt(result.price) <= parseInt(data.offerValue)) {
                  newOffer.save((err, of) => {
                    if (!err) {
                      sio.sockets.in(of.idOffer).emit("refOffer", of);
                    }
                  });
                }
              }
            });
        })
        .catch(err => console.log(err));
    });

    socket.on("disconnect", () => {
      console.log("Disconected");
    });
  });
};

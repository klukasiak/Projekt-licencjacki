<template>
  <div id="container">
    <div v-for="(auction, index) in auctions" :key="index">
      Title: {{ auction.title }} TopOffer: {{ topOffers[index].offerValue }} by {{ topOffers[index].username }}
      <input
        type="number"
        :id="'input' + index"
      />
      <button @click="giveOffer(index)">Offer</button>
    </div>
  </div>
</template>

<script>
import AuctionService from "../../services/AuctionService";
import UserService from "../../services/UserService";
// import router from "../../router";

export default {
  name: "user-auction-panel",
  data() {
    return {
      auctions: [],
      user: {},
      offers: [],
      topOffers: [],
      socket: null
    };
  },
  sockets: {
    refOffer: function(data) {
      console.log("REFF");
      console.log(data);
      console.log(this.topOffers);
      this.auctions.forEach(item => {
        if (item._id == data.idOffer) {
          let index = this.auctions.indexOf(item);
          this.topOffers[index] = data;
        }
      });
    }
  },
  methods: {
    retriveUser() {
      UserService.get()
        .then(response => {
          this.user = response.data.user;
          AuctionService.getOffersByUser(this.user.username).then(response => {
            this.offers = response.data;
            this.offers = this.offers.map(o => o.idOffer);
            this.offers = this.offers.reduce(
              (unique, item) =>
                unique.includes(item) ? unique : [...unique, item],
              []
            );
            this.offers.forEach(offer => {
              console.log(offer);
              AuctionService.getNotBuyNowAndId(offer)
                .then(response => {
                  console.log(response.data[0]);
                  if (response.data[0] !== undefined) {
                    this.auctions.push(response.data[0]);
                    this.socket.emit("joinAuctions", {
                      idAuction: response.data[0]._id
                    });
                    AuctionService.findTopOffer(response.data[0]._id)
                      .then(resp => {
                        console.log(resp);
                        this.topOffers.push({
                          offerValue: resp.data[0].offerValue,
                          username: resp.data[0].username
                        });
                      })
                      .catch(err => console.log(err));
                  }
                })
                .catch(err => console.log(err));
            });
          });
        })
        .catch(err => console.log(err));
    },
    giveOffer(index) {
      let value = document.getElementById("input" + index).value;
      let offer = {
        idAuction: this.auctions[index]._id,
        username: this.user.username,
        offerValue: value
      };
      console.log(offer);
      if (parseInt(value) > parseInt(this.topOffers[index].offerValue)) {
        this.socket.emit("newOffer", offer);
      } else {
        this.socket.emit("newOffer", offer);
      }
    }
  },
  mounted() {
    this.retriveUser();
    this.socket = this.$socket.client;
    console.log(this.socket);
    this.socket.on("refOffer", data => {
      console.log("REFFF");
      this.auctions.forEach(item => {
        if (item._id == data.idOffer) {
          let index = this.auctions.indexOf(item);
          console.log("Index f");
          console.log(index);
          this.topOffers[index] = data;
        }
      });
    });
  },
  destroyed() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/auctpanel.scss";
</style>
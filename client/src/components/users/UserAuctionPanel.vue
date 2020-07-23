<template>
  <b-container fluid>
    <b-row align-v="center">
      <b-col v-for="(auction, index) in auctions" :key="index">
        <b-card class="mb-2">
          <b-card-text>
            <b>Title:</b> {{ auction.title }} <br />
            <b>TopOffer:</b> {{ topOffers[index].offerValue }} by {{ topOffers[index].username }}
          </b-card-text>
          <b-form-input
            type="number"
            :id="'input' + index"
          />
          <b-button variant="success" @click="giveOffer(index)">Offer</b-button>
        </b-card>
      </b-col>
    </b-row>
    <b-alert v-model="showError" variant="danger" dismissible>
        Offer is too low!
    </b-alert>
  </b-container>
</template>

<script>
import AuctionService from "../../services/AuctionService";
import UserService from "../../services/UserService";

export default {
  name: "user-auction-panel",
  data() {
    return {
      auctions: [],
      user: {},
      offers: [],
      topOffers: [],
      socket: null,
      showError: false
    };
  },
  sockets: {
    refOffer: function(data) {
      this.auctions.forEach(item => {
        if (item._id == data.idOffer) {
          let index = this.auctions.indexOf(item);
          this.topOffers[index].offerValue = data.offerValue;
          this.topOffers[index].username = data.username;
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
              AuctionService.getNotBuyNowAndId(offer)
                .then(response => {
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
        this.showError = true;
      }
    }
  },
  mounted() {
    this.showError = false;
    this.retriveUser();
    this.socket = this.$socket.client;
    this.socket.on("refOffer", data => {
      this.auctions.forEach(item => {
        if (item._id == data.idOffer) {
          let index = this.auctions.indexOf(item);
          this.topOffers[index].offerValue = data.offerValue;
          this.topOffers[index].username = data.username;
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
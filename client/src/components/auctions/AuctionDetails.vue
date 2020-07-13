<template>
  <div id="container">
    <div>
      <h3>Auction</h3>
      <h4>Title: {{ auction.title }}</h4>
      <p>Description: {{ auction.description }}</p>
      Price: {{ auction.price }}
      <br />
      <div v-if="!auction.buyNow">
        <div v-if="offers.length > 0">
          Highest Offer: <b>{{ offers[offers.length - 1].offerValue }}</b>
          <br />
        </div>
      </div>
      <br />
      Start Date: {{ dateString(auction.startDate) }}
      <br />
      End Date: {{ dateString(auction.endDate) }}
      <br />
      Owner: {{ owner.username }}
      <br />
      <div v-if="!empty">
        <div v-if="isStarted && this.auction.owner != this.user._id">
          <input type="number" name="value" id="value" v-if="!auction.buyNow" /><br />
          <button @click="giveOffer()">Offer</button>
          <p v-if="message">{{ message }}</p>
        </div>
      </div>
      <div v-else>Zaloguj sie aby brac udzial w licytacji</div>
      <div v-if="dateToStart"><b>{{ dateToStart }}</b></div>
      <button
        v-if="user._id == auction.owner && !isStarted && new Date(this.auction.endDate).getTime() > new Date().getTime()"
        @click="routeTo()"
      >Edit</button>
    </div>
    <div id="offers">
      <p
        v-for="(offer, index) in offers"
        :key="index"
      >{{offer.offerValue}} {{offer.username}} {{ dateString(offer.date) }}</p>
    </div>
  </div>
</template>

<script>
import AuctionService from "../../services/AuctionService";
import UserService from "../../services/UserService";
import router from "../../router";
import moment from "moment";

export default {
  name: "auction-detail",
  data() {
    return {
      auction: {},
      owner: {},
      user: {},
      offers: [],
      empty: true,
      message: "",
      isStarted: false,
      dateToStart: "",
      socket: null
    };
  },
  sockets: {},
  methods: {
    getAuction(id) {
      AuctionService.get(id)
        .then(response => {
          this.auction = response.data;
          UserService.getById(this.auction.owner)
            .then(response => {
              this.owner = response.data;
              console.log(response.data);
              this.socket.emit("joinAuction", {
                idAuction: this.auction._id
              });
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    },
    retriveUser() {
      UserService.get()
        .then(response => {
          this.user = response.data.user;
          console.log(this.user);
          this.empty = false;
        })
        .catch(err => console.log(err));
    },
    getOffers() {
      AuctionService.getOffersByAuctionId(this.auction._id).then(response => {
        this.offers = response.data;
        this.offers.sort((a, b) => (a.offerValue > b.offerValue ? 1 : -1));
        console.log(this.offers);
      });
    },
    giveOffer() {
      if (this.isStarted) {
        let value = document.getElementById("value").value;
        if (this.offers !== undefined && this.offers.length != 0) {
          console.log("offers");
          if (
            parseInt(this.offers[0].offerValue) > parseInt(value) &&
            parseInt(this.auction.price) > parseInt(value)
          ) {
            this.message = "Offer to low";
          } else {
            let offer = {
              idAuction: this.auction._id,
              username: this.user.username,
              offerValue: value
            };
            this.socket.emit("newOffer", offer);
          }
        } else {
          console.log("nooffers");
          let offer = {
            idAuction: this.auction._id,
            username: this.user.username,
            offerValue: value
          };
          this.socket.emit("newOffer", offer);
        }
      } else {
        console.log("Its sold");
        this.message = "Its sold";
      }
    },
    checkDate() {
      return (
        new Date(this.auction.endDate).getTime() > new Date().getTime() &&
        new Date(this.auction.startDate).getTime() < new Date().getTime()
      );
    },
    routeTo() {
      router.push(`/auctionform/${this.auction._id}`);
    },
    dateString(date) {
      return new Date(date).toLocaleString();
    },
    calcDateToStart() {
      if (new Date(this.auction.endDate).getTime() < new Date().getTime()) {
        return "Auction is ended";
      } else if (this.isStarted) {
        let end = moment(new Date(this.auction.endDate)).fromNow();
        return `End: ${end}`;
      } else {
        let begin = moment(new Date(this.auction.startDate)).fromNow();
        return `Begin: ${begin}`;
      }
    }
  },
  mounted() {
    this.getAuction(this.$route.params.id);
    this.socket = this.$socket.client;
    console.log(this.socket);
    this.socket.on("refOffer", data => {
      this.offers.push(data);
    });
    setInterval(() => {
      if (this.checkDate()) {
        this.isStarted = true;
      } else {
        this.isStarted = false;
      }
      this.dateToStart = this.calcDateToStart();
    }, 1000);
    this.retriveUser();
    setTimeout(() => {
      this.getOffers();
      this.checkDate();
    }, 300);
  },
  destroyed() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/auctiondet.scss";
</style>
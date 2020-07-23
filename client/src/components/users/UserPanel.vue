<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-card class="text-center" title="My data">
          Username: {{ user.username }} <br />
          First Name: {{ user.firstName }} <br />
          Last Name: {{ user.lastName }} <br />
          City: {{ user.city }} <br />
          Street: {{ user.street }} <br />
        </b-card>
      </b-col>
      <b-col class="text-center">
        <h4>History:</h4>
        <em>My auctions:</em>
        <div style="position:relative; height:150px; overflow-y:scroll; margin:20px; padding:20px;">
          <p v-for="(auction, index) in myAuctionsHistory" :key="index">
            <a :href="'/auction/' + auction._id">{{auction.title}}</a>
          </p>
        </div>
        <em>Auctions won:</em>
        <div style="position:relative; height:150px; overflow-y:scroll; margin:20px; padding:20px;">
          <p v-for="(auction, index) in wonAuctionsHistory" :key="index">
            <a :href="'/auction/' + auction._id">{{auction.title}}</a>
          </p>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import AuctionService from "../../services/AuctionService";
import UserService from "../../services/UserService";

export default {
  name: "user-panel",
  data() {
    return {
      user: {},
      myAuctionsHistory: [],
      wonAuctionsHistoryIds: [],
      wonAuctionsHistory: []
    };
  },
  sockets: {},
  methods: {
    retriveUser() {
      UserService.get()
        .then(response => {
          this.user = response.data.user;
        })
        .catch(err => console.log(err));
    },
    getMyAuctions() {
      AuctionService.getByOwner(this.user._id)
        .then(response => {
          this.myAuctionsHistory = response.data;
        })
        .catch(err => console.log(err));
    },
    getWonAuctionsIds() {
      AuctionService.getOffersByUserId(this.user._id)
        .then(response => {
          let offers = response.data;
          offers = offers.map(m => m.idOffer);
          offers = offers.reduce(
            (unique, item) =>
              unique.includes(item) ? unique : [...unique, item],
            []
          );
          offers.forEach(item => {
            AuctionService.getOffersByAuctionId(item)
              .then(response => {
                let s = response.data.sort((a, b) =>
                  a.date < b.date ? 1 : -1
                );
                if (s[0].idUser == this.user._id) {
                  this.wonAuctionsHistoryIds.push(s[0].idOffer);
                }
              })
              .catch(err => console.log(err));
          });
        })
        .catch(err => console.log(err));
    },
    getWonAuctions() {
      this.wonAuctionsHistoryIds.forEach(item => {
        AuctionService.get(item)
          .then(response => {
            this.wonAuctionsHistory.push(response.data);
          })
          .catch(err => console.log(err));
      });
    }
  },
  mounted() {
    this.retriveUser();
    setTimeout(() => {
      this.getMyAuctions();
      this.getWonAuctionsIds();
      setTimeout(() => {
        this.getWonAuctions();
        console.log(this.wonAuctionsHistory);
      }, 300);
    }, 300);
  }
};
</script>
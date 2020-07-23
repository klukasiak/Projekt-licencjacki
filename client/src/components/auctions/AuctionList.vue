<template>
  <div class="text-center">
    <div>
      <b-row v-for="(auction, index) in auctions" :key="index" class="align-self-center text-center">
        <b-card tag="article" style="width: 100%; margin: 10px;" class="align-self-center text-center">
          <b-card-title>{{ auction.title }}</b-card-title>
          <b-card-text>
            <b>Price:</b> {{ auction.price }} <br/>
            <b>Ends in:</b> {{ calcDate(auction.endDate) }}
          </b-card-text>

          <b-button :href="'/auction/' + auction._id" variant="primary">Details</b-button>
        </b-card>
      </b-row>
    </div>
    <b-button-group class="text-center">
      <b-button @click="prevPage" :disabled="pageNumber<=0">&lt;&lt;</b-button>
      <b-button>{{ pageNumber + 1 }}</b-button>
      <b-button @click="nextPage" :disabled="pageNumber >= totalNumber/5">&gt;&gt;</b-button>
    </b-button-group>
  </div>
</template>

<script>
import AuctionService from "../../services/AuctionService";
import UserService from "../../services/UserService";
import router from "../../router";
import moment from "moment";

export default {
  name: "auctions-list",
  data() {
    return {
      auctions: [],
      user: {},
      pageNumber: 0,
      totalNumber: 0
    };
  },
  methods: {
    retrieveAuctions() {
      AuctionService.getPage(this.pageNumber)
        .then(response => {
          this.auctions = response.data.auctions;
          this.totalNumber = response.data.total;
        })
        .catch(e => {
          console.log(e);
        });
    },
    retriveUser() {
      UserService.get()
        .then(response => {
          this.user = response.data.user;
        })
        .catch(err => console.log(err));
    },
    getAuction(auction) {
      router.push("/auction/" + auction._id);
    },
    nextPage() {
      this.pageNumber++;
      this.retrieveAuctions();
    },
    prevPage() {
      this.pageNumber--;
      this.retrieveAuctions();
    },
    calcDate(date) {
      return moment(new Date(date)).fromNow();
    }
  },
  mounted() {
    this.retrieveAuctions();
    this.retriveUser();
  }
};
</script>
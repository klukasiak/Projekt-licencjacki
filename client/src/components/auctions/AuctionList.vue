<template>
  <div id="container">
    <h1>Auctions List</h1>
    <ul>
      <li v-for="(auction, index) in auctions" :key="index">
        <a :href="'/auction/' + auction._id">{{ auction.title }}  {{ auction.price }} <div v-if="auction.buyNow">BuyNow</div></a>
      </li>
    </ul>
    <button @click="prevPage" :disabled="pageNumber<=0">&lt;&lt;&lt;</button>
    <button>{{ pageNumber + 1 }}</button>
    <button @click="nextPage" :disabled="pageNumber >= totalNumber/5">&gt;&gt;&gt;</button>
  </div>
</template>

<script>
import AuctionService from "../../services/AuctionService";
import UserService from "../../services/UserService";
import router from "../../router";

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
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    retriveUser() {
      UserService.get()
        .then(response => {
          this.user = response.data.user;
          console.log(response.data);
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
    }
  },
  mounted() {
    this.retrieveAuctions();
    this.retriveUser();
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/auctlist.scss";
</style>
<template>
  <div id="container">
    <p>Dodaj aukcje:</p>
    <div id="form">
      <label>Title:</label>
      <br />
      <input type="text" name="title" v-model="auction.title" />
      <br />
      <label>Description:</label>
      <br />
      <textarea type="text" name="description" v-model="auction.description"></textarea>
      <br />
      <label>Price:</label>
      <br />
      <input type="number" name="price" v-model="auction.price" />
      <br />
      <label>Start Date:</label>
      <br />
      <input type="datetime-local" name="startDate" v-model="auction.startDate" />
      <br />
      <label>End Date:</label>
      <br />
      <input type="datetime-local" name="endDate" v-model="auction.endDate" />
      <br />
      <label>Buy now:</label>
      <input type="checkbox" name="buyNow" v-model="auction.buyNow" />
      <br />
      <button @click="addAuction()">Submit</button>
    </div>
  </div>
</template>

<script>
import AuctionService from "../../services/AuctionService";
import UserService from "../../services/UserService";
import router from "../../router";
import moment from "moment";

export default {
  name: "auction-form",
  data() {
    return {
      auction: {}
    };
  },
  methods: {
    retriveUser() {
      UserService.get()
        .then(response => {
          this.auction.owner = response.data.user._id;
        })
        .catch(err => console.log(err));
    },
    getAuction(id) {
      AuctionService.get(id)
        .then(response => {
          this.auction = response.data;
          let data = moment(new Date(this.auction.startDate)).format(
            "yyyy-MM-DDTHH:mm:ss"
          );
          console.log(data);
          console.log(new Date(data).toISOString());
        })
        .catch(err => console.log(err));
    },
    addAuction() {
      if (this.auction._id) {
        AuctionService.updateAuction(this.auction._id, this.auction)
          .then(() => {
            console.log("Edited");
            router.push("/auction/" + this.auction._id);
          })
          .catch(err => console.log(err));
      } else {
        console.log("w else");
        AuctionService.add(this.auction)
          .then(response => {
            console.log("Added");
            router.push("/auction/" + response.data._id);
          })
          .catch(err => console.log(err));
      }
    }
  },
  mounted() {
    console.log(this.$route.params.id);
    if (this.$route.params.id) {
      console.log("TO EDIT .......");
      this.auction = this.getAuction(this.$route.params.id);
      console.log(this.auction);
    } else {
      this.retriveUser();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/login.scss";
</style>
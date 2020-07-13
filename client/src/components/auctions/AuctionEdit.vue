<template>
  <div id="container">
    <p>Dodaj aukcje:</p>
    <div id="form">
      <label>Title:</label>
      <br />
      <input type="text" name="title" v-model="input.title" />
      <br />
      <label>Description:</label>
      <br />
      <textarea type="text" name="description" v-model="input.description"></textarea>
      <br />
      <label>Price:</label>
      <br />
      <input type="number" name="price" v-model="input.price" />
      <br />
      <label>Start Date:</label>
      <br />
      <input type="datetime-local" name="startDate" v-model="input.startDate" />
      <br />
      <label>End Date:</label>
      <br />
      <input type="datetime-local" name="endDate" v-model="input.endDate" />
      <br />
      <label>Buy now:</label>
      <input type="checkbox" name="buyNow" v-model="input.buyNow" />
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
  name: "auction-edit-form",
  data() {
    return {
      auctionid: "",
      user: {},
      input: {
        title: "",
        description: "",
        price: 0,
        buyNow: false,
        owner: "",
        startDate: new Date(),
        endDate: new Date()
      }
    };
  },
  methods: {
    retriveUser() {
      UserService.get()
        .then(response => {
          this.input.owner = response.data.user._id;
        })
        .catch(err => console.log(err));
    },
    addAuction() {
      this.input.startDate = moment(this.input.startDate)
        .add(2, "hours")
        .format("YYYY-MM-DDTHH:mm:ss");
      this.input.endDate = moment(this.input.endDate)
        .add(2, "hours")
        .format("YYYY-MM-DDTHH:mm:ss");
      AuctionService.add(this.auctionid, this.input)
        .then(response => {
          console.log(response);
          console.log("Added");
          console.log("");
          router.push("/auction/" + response.data._id);
        })
        .catch(err => console.log(err));
    }
  },
  mounted() {
    this.auctionid = this.$route.params.id;
    this.retriveUser();
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/login.scss";
</style>
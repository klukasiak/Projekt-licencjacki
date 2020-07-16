<template>
  <div>
    <b-form-group id="input-group-1" label="Title:" label-for="input-1">
      <b-form-input id="input-1" v-model="auction.title" required placeholder="Title"></b-form-input>
    </b-form-group>

    <b-form-group id="input-group-2" label="Description:" label-for="input-2">
      <b-form-input id="input-2" v-model="auction.description" required placeholder="Description"></b-form-input>
    </b-form-group>

    <b-form-group id="input-group-3" label="Price:" label-for="input-3">
      <b-form-input id="input-3" v-model="auction.price" required type="number"></b-form-input>
    </b-form-group>

    <b-form-group id="input-group-4" label="Start date:" label-for="input-4">
      <input type="datetime-local" name="startDate" v-model="auction.startDate" id="input-4"/>
    </b-form-group>

    <b-form-group id="input-group-5" label="End date:" label-for="input-5">
      <input type="datetime-local" name="endDate" v-model="auction.endDate" id="input-5"/>
    </b-form-group>

    <b-form-group id="input-group-6" label="Buy now:" label-for="input-6">
      <b-form-checkbox id="input-6" v-model="auction.buyNow">Buy now</b-form-checkbox>
    </b-form-group>

    <b-button variant="primary" @click="addAuction()">Submit</b-button>
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
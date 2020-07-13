<template>
  <div id="app">
    <div id="container">
      <div id="navigation-bar">
        <nav>
          <h2 class="logo" v-if="isLoggedIn">Hello {{ user.username }}</h2>
          <h2 class="logo" v-else>Hello Guest</h2>
          <input type="checkbox" id="chk" />
          <label for="chk" class="show-menu-btn">
            <i>Menu</i>
          </label>
          <ul v-if="isLoggedIn" class="menu">
            <a href="/">Auctions</a>
            <a href="/chat">Chat</a>
            <a href="/userpanel">History</a>
            <a href="/auctionform">Add auction</a>
            <a href="/auctionpanel">Current Auctions</a>
            <a href @click="logout()">Logout</a>
            <label for="chk" class="hide-menu-btn">
              <i>X</i>
            </label>
          </ul>
          <ul v-else class="menu">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
            <label for="chk" class="hide-menu-btn">
              <i>X</i>
            </label>
          </ul>
        </nav>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import router from "./router";
import UserService from "./services/UserService";

export default {
  name: "App",
  data() {
    return {
      user: {},
      isLoggedIn: false
    };
  },
  methods: {
    retriveUser() {
      UserService.get()
        .then(response => {
          this.user = response.data.user;
          this.isLoggedIn = true;
        })
        .catch(err => {
          console.log(err);
          this.isLoggedIn = false;
        });
    },
    logout() {
      UserService.logout()
        .then(response => {
          console.log(response);
          this.isLoggedIn = false;
          console.log("Logged out");
          router.push("/");
        })
        .catch(err => console.log(err));
    }
  },
  mounted() {
    this.retriveUser();
  }
};
</script>

<style lang="scss" scoped>
@import "./style/navbar.scss";
</style>

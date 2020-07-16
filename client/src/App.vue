<template>
  <div>
    <nav>
      <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
          <b-navbar-brand href="#">Auction App</b-navbar-brand>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav v-if="isLoggedIn">
              <b-nav-item href="/">Auctions</b-nav-item>
              <b-nav-item href="/chat">Chat</b-nav-item>
              <b-nav-item href="/auctionform">Add Auction</b-nav-item>
              <b-nav-item href="/auctionpanel">Current Auctions</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav v-else>
              <b-nav-item href="/">Auctions</b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
              <b-nav-item-dropdown right v-if="isLoggedIn">
                <template v-slot:button-content>
                  <em>{{ user.username }}</em>
                </template>
                <b-dropdown-item href="/userpanel">Profile</b-dropdown-item>
                <b-dropdown-item @click="logout()">Sign Out</b-dropdown-item>
              </b-nav-item-dropdown>

              <b-nav-item-dropdown right v-else>
                <template v-slot:button-content>
                  <em>Guest</em>
                </template>
                <b-dropdown-item href="/login">Login</b-dropdown-item>
                <b-dropdown-item href="/register">Register</b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
    </nav>
    <b-container fluid>
      <router-view />
    </b-container>
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

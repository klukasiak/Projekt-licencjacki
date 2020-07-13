import Vue from "vue";
import Router from "vue-router";
import Vuecookies from "vue-cookies";

Vue.use(Router);
Vue.use(Vuecookies);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "auctions",
      component: () => import("./components/auctions/AuctionList")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./components/users/LoginForm")
    },
    {
      path: "/register",
      name: "register",
      component: () => import("./components/users/RegistrationForm")
    },
    {
      path: "/chat",
      name: "chat",
      component: () => import("./components/users/Chat")
    },
    {
      path: "/userpanel",
      name: "userpanel",
      component: () => import("./components/users/UserPanel")
    },
    {
      path: "/auction/:id",
      name: "auction-details",
      component: () => import("./components/auctions/AuctionDetails")
    },
    {
      path: "/auctionform",
      name: "auctionform",
      component: () => import("./components/auctions/AuctionForm")
    },
    {
      path: "/auctionpanel",
      name: "auctionpanel",
      component: () => import("./components/users/UserAuctionPanel")
    },
    {
      path: "/auctionform/:id",
      name: "auctionedit",
      component: () => import("./components/auctions/AuctionForm")
    }
  ]
});
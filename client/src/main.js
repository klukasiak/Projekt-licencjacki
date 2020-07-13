import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";
 
const socket = io(`https://${location.host}`, { secure: true });

Vue.use(VueSocketIOExt, socket);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
<template>
  <div id="container">
    <p>Sign in:</p>
    <div id="form">
      <label for="username">Username:</label>
      <br />
      <input type="text" name="username" id="username" v-model="input.username" />
      <br />
      <label for="password">Password:</label>
      <br />
      <input type="password" name="password" id="password" v-model="input.password" />
      <br />
      <button @click="login()">Log in</button>
    </div>
  </div>
</template>

<script>
import UserService from "../../services/UserService";
import router from "../../router";

export default {
  name: "login",
  data() {
    return {
      input: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      if (this.input.username != "" && this.input.password != "") {
        UserService.login(this.input)
          .then(() => {
            console.log("Logged in");
            router.push("/");
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  },
  mounted() {
    console.log(this.input);
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/login.scss";
</style>
<template>
  <div id="container">
    <p>Register:</p>
    <br />
    <div id="form">
      <label>Username:</label>
      <br />
      <input type="text" name="username" v-model="input.username" />
      <br />
      <label>Password:</label>
      <br />
      <input type="password" name="password" v-model="input.password" />
      <br />
      <label>First name:</label>
      <br />
      <input type="text" name="firstName" v-model="input.firstName" />
      <br />
      <label>Last name:</label>
      <br />
      <input type="text" name="lastName" v-model="input.lastName" />
      <br />
      <label>City:</label>
      <br />
      <input type="text" name="lastName" v-model="input.city" />
      <br />
      <label>Street:</label>
      <br />
      <input type="text" name="lastName" v-model="input.street" />
      <br />
      <button @click="register()">Register</button>
    </div>
  </div>
</template>

<script>
import UserService from "../../services/UserService";
import router from "../../router";

export default {
  name: "register",
  data() {
    return {
      input: {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        city: "",
        street: ""
      }
    };
  },
  methods: {
    register() {
      if (
        this.input.username != "" &&
        this.input.password != "" &&
        this.input.firstName != "" &&
        this.input.lastName != ""
      ) {
        UserService.register(this.input)
          .then(response => {
            console.log("Registred");
            console.log(response);
            router.push("/login");
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
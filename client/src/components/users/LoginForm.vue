<template>
  <div>
    <b-form class="align-self-center">
      <b-form-group
        id="input-group-1"
        label="Usename:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="input.username"
          type="username"
          required
          placeholder="Your Username"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input id="input-2" v-model="input.password" required placeholder="Your Password" type="password"></b-form-input>
      </b-form-group>

      <b-button variant="primary" @click="login()">Submit</b-button>
    </b-form>
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
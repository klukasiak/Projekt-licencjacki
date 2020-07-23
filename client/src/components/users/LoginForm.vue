<template>
  <div>
    <b-form class="align-self-center">
      <b-form-group
        id="input-group-1"
        label="Usename:"
        label-for="input-1"
        required
      >
        <b-form-input
          id="input-1"
          v-model="input.username"
          type="username"
          :state="usernameState"
          aria-describedby="input-error"
          required
          placeholder="Your Username"
        ></b-form-input>
        <b-form-invalid-feedback id="input-error">
          Enter valid username.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input id="input-2" v-model="input.password" required placeholder="Your Password" type="password" :state="passwordState" aria-describedby="input-error2"></b-form-input>
        <b-form-invalid-feedback id="input-error2">
          Enter valid password.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button variant="primary" @click="login()">Submit</b-button>
      <b-alert v-model="showAlert" variant="danger" dismissible>
        Cannot log in, check your username and password.
      </b-alert>
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
      },
      showAlert: false
    };
  },
  methods: {
    usernameState() {
      return this.input.username != "";
    },
    passwordState() {
      return this.input.password != "";
    },
    login() {
      if (this.usernameState() && this.passwordState()) {
        UserService.login(this.input)
          .then(() => {
            router.push("/");
          })
          .catch(err => {
            this.showAlert = true;
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
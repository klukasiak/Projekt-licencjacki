<template>
  <div>
    <b-form class="align-self-center">
      <b-form-group id="input-group-1" label="Usename:" label-for="input-1">
        <b-form-input id="input-1" v-model="input.username" type="username" required placeholder="Username"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input id="input-2" v-model="input.password" required placeholder="Password" type="password"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="First name:" label-for="input-3">
        <b-form-input id="input-3" v-model="input.firstName" required placeholder="Name"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Last name:" label-for="input-4">
        <b-form-input id="input-4" v-model="input.lastName" required placeholder="Last name"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-5" label="City:" label-for="input-5">
        <b-form-input id="input-5" v-model="input.city" placeholder="City"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-6" label="Street:" label-for="input-6">
        <b-form-input id="input-6" v-model="input.street" placeholder="Street"></b-form-input>
      </b-form-group>

      <b-button variant="primary" @click="register">Submit</b-button>
    </b-form>
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
          .then(() => {
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
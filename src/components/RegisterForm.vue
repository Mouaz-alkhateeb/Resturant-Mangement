<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8">
      <v-row
        ><v-col cols="12" sm="12">
          <v-text-field
            label="Name"
            dense
            color="teal"
            autocomplete="false"
            v-model="name"
          ></v-text-field>
          <span class="red--text" v-if="v$.name.$error">{{
            v$.name.$errors[0].$message
          }}</span>
        </v-col>
      </v-row>
      <v-text-field
        dense
        color="teal"
        label="E-mail"
        autocomplete="false"
        class="mt-12"
        v-model="email"
      ></v-text-field>
      <span class="red--text" v-if="v$.email.$error">{{
        v$.email.$errors[0].$message
      }}</span>
      <v-text-field
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="show1 = !show1"
        :type="show1 ? 'text' : 'password'"
        v-model="password"
        dense
        color="teal"
        label="Password"
        autocomplete="false"
        class="mt-12"
      ></v-text-field>
      <span class="red--text" v-if="v$.password.$error">{{
        v$.password.$errors[0].$message
      }}</span>
      <v-btn color="teal" dark block rounded @click.prevent="register()"
        >Sign up</v-btn
      >
      <h5 class="text-center grey--text mt-4 mb-3">Or Sign up using</h5>
      <div class="d-flex justify-space-between align-center mx-10 mb-11">
        <v-btn color="white" text fab>
          <v-icon large color="blue">mdi-facebook</v-icon>
        </v-btn>
        <v-btn color="white" text fab>
          <v-icon large color="red">mdi-google</v-icon>
        </v-btn>
        <v-btn color="white" text fab>
          <v-icon large color="light-blue lighten-3">mdi-twitter</v-icon>
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import axios from "axios";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      show1: false,
      show2: true,
      name: "",
      password: "",
      email: "",
    };
  },
  validations() {
    return {
      name: { required },
      password: { required, minLength: minLength(8) },
      email: { required, email },
    };
  },
  methods: {
    async register() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.post("http://localhost:3000/users", {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        if (result.status == 201) {
          localStorage.setItem("users", JSON.stringify(result.data));
          this.$router.push("/");
        } else {
          console.log("user added failed..!");
        }
      } else {
        console.log("reigerster failed..!");
      }
    },
  },
  mounted() {
    let user = localStorage.getItem("users");
    if (user) {
      this.$router.push("/");
    }
  },
};
</script>


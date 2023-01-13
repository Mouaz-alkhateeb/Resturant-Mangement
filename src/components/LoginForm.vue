<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8">
      <v-text-field
        dense
        color="teal"
        label="E-mail"
        autocomplete="false"
        class="mt-16"
        v-model="state.email"
      ></v-text-field>
      <span class="red--text" v-if="v$.email.$error">{{
        v$.email.$errors[0].$message
      }}</span>
      <v-text-field
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="show1 = !show1"
        :type="show1 ? 'text' : 'password'"
        v-model="state.password"
        dense
        color="teal"
        label="Password"
        autocomplete="false"
        class="mt-16"
      ></v-text-field>
      <span class="red--text" v-if="v$.password.$error">{{
        v$.password.$errors[0].$message
      }}</span>
      <v-alert dense outlined type="error" v-if="UserNotFound.length > 0">
        {{ UserNotFound }}
      </v-alert>
      <v-btn color="teal" dark block rounded @click.prevent="login()">
        Login
      </v-btn>
      <h5 class="text-center grey--text mt-4 mb-3">Or Login By Social media</h5>
      <div class="d-flex justify-space-between align-center mx-10 mb-16">
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
import { required, email } from "@vuelidate/validators";
import { computed, reactive } from "vue-demi";
import axios from "axios";
export default {
  setup() {
    const state = reactive({
      email: "",
      password: "",
    });
    const rules = computed(() => {
      return {
        email: { required, email },
        password: { required },
      };
    });
    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
    };
  },
  mounted() {
    let user = localStorage.getItem("users");
    if (user) {
      this.$router.push("/");
    }
  },
  data() {
    return {
      show1: false,
      show2: true,
      UserNotFound: "",
    };
  },
  methods: {
    async login() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.get(
          `http://localhost:3000/users?email=${this.state.email}&password=${this.state.password}`
        );
        if (result.status == 200 && result.data.length > 0) {
          localStorage.setItem("users", JSON.stringify(result.data[0]));
          this.$router.push("/");
        } else {
          this.UserNotFound = "User Not Found..!";
        }
      } else {
        console.log("login failed..!");
      }
    },
  },
};
</script>

<style>
</style>
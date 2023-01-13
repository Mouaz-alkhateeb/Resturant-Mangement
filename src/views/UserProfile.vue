<template>
  <div class="Update">
    <v-subheader
      class="py-0 d-flex justify-space-between rounded-lg grey--text"
    >
      <h2>Personal Profile</h2>
    </v-subheader>
    <br />
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="pa-2" flat>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12">
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
                <v-col cols="12">
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
                </v-col>
                <v-col cols="12">
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
                </v-col>
                <v-col cols="12">
                  <v-alert
                    dense
                    outlined
                    type="error"
                    v-if="userNotUpdate.length > 0"
                  >
                    {{ userNotUpdate }}
                  </v-alert>
                  <v-alert
                    dense
                    text
                    type="success"
                    v-if="userUpdate.length > 0"
                  >
                    {{ userUpdate }}
                  </v-alert>
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn
                    color="teal"
                    outlined
                    rounded
                    class="mr-0"
                    @click="update()"
                  >
                    Update
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="text-center" flat>
          <v-img height="250" src="../assets/bg-profile.jpg">
            <v-responsive class="pt-15">
              <v-avatar size="150" class="grey darken-2 mb-0">
                <img src="https://cdn.vuetifyjs.com/images/john.jpg" />
              </v-avatar> </v-responsive
          ></v-img>
          <v-card-text class="text-center">
            <h4 class="display-1 font-weight-light mb-3">{{ name }}</h4>
            <p class="teal--text">{{ email }}</p>
            <v-btn color="teal" rounded outlined class="mr-0 mb-2" small>
              Follow
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import indexLayout from "../layouts/indexLayout.vue";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import axios from "axios";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  created() {
    this.$emit("update:layout", indexLayout);
  },
  data() {
    return {
      show1: false,
      show2: true,
      name: "",
      password: "",
      email: "",
      userId: "",
      userNotUpdate: "",
      userUpdate: "",
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
    async update() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.put(
          `http://localhost:3000/users/${this.userId}`,
          { name: this.name, email: this.email, password: this.password }
        );
        if (result.status == 200) {
          localStorage.setItem("users", JSON.stringify(result.data));
          this.userUpdate = "user updateed succesfully";
        }
      } else {
        this.userNotUpdate = "user updateed failed";
      }
    },
  },
  mounted() {
    let user = localStorage.getItem("users");
    if (user) {
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.password = JSON.parse(user).password;
      this.userId = JSON.parse(user).id;
    } else {
      this.$router.push("/login");
    }
  },
};
</script>

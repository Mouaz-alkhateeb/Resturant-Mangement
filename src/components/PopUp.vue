<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" small v-bind="attrs" v-on="on" outlined rounded>
        <v-icon class="mr-1">mdi-plus-circle-multiple-outline</v-icon>
        <span>Add Resturant</span>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add A New Resturant</span>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field
            label="Resturant Name"
            v-model="state.name"
            prepend-icon="mdi-rename-box"
          ></v-text-field>
          <span class="red--text" v-if="v$.name.$error">{{
            v$.name.$errors[0].$message
          }}</span>
          <v-text-field
            label="Address"
            v-model="state.addres"
            prepend-icon=" mdi-city"
          ></v-text-field>
          <span class="red--text" v-if="v$.addres.$error">{{
            v$.addres.$errors[0].$message
          }}</span>
          <v-text-field
            label="Phone Number"
            v-model="state.phone"
            prepend-icon=" mdi-phone-classic"
          ></v-text-field>
          <span class="red--text" v-if="v$.phone.$error">{{
            v$.phone.$errors[0].$message
          }}</span>
          <br />
          <v-alert
            class="mt-2"
            dense
            outlined
            type="error"
            v-if="LocationError.length > 0"
          >
            {{ LocationError }}
          </v-alert>
          <v-alert
            class="mt-2"
            dense
            text
            type="success"
            v-if="LocationSuccess.length > 0"
          >
            {{ LocationSuccess }}
          </v-alert>
          <br />
          <v-btn
            color="blue darken-1"
            text
            @click.prevent="addResturant()"
            rounded
          >
            Add Now
          </v-btn>
          <v-btn color="red darken-1" text @click.prevent="close()" rounded>
            close
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { computed, reactive } from "vue";
import axios from "axios";
export default {
  setup() {
    const state = reactive({
      name: "",
      addres: "",
      phone: "",
    });
    const rules = computed(() => {
      return {
        name: { required, minLength: minLength(8) },
        addres: { required },
        phone: { required },
      };
    });
    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
    };
  },
  data: () => ({
    dialog: false,
    userId: "",
    LocationError: "",
    LocationSuccess: "",
  }),
  mounted() {
    let user = localStorage.getItem("users");
    if (!user) {
      this.$router.push("/");
    } else {
      this.userId = JSON.parse(user).id;
    }
  },
  methods: {
    async addResturant() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.post(`http://localhost:3000/locations`, {
          name: this.state.name,
          phone: this.state.phone,
          addres: this.state.addres,
          userId: this.userId,
        });
        if (result.status == 201) {
          this.LocationSuccess = "Resturant Added Succesfully";
          setTimeout(() => {
            this.dialog = false;
            this.state.name = "";
            this.state.phone = "";
            this.state.addres = "";
            this.LocationError = "";
            this.LocationSuccess = "";
            this.v$.name.$errors[0].$message = "";
            this.v$.addres.$errors[0].$message = "";
            this.v$.phone.$errors[0].$message = "";
            setTimeout(() => {
              location.reload();
            }, 1000);
          }, 2000);
        } else {
          this.LocationError = "Resturant Added Failed";
        }
      } else {
        this.LocationError = "Resturant Added Failed";
      }
    },
    close() {
      this.state.name = "";
      this.state.phone = "";
      this.state.addres = "";
      this.LocationError = "";
      this.LocationSuccess = "";
      this.dialog = false;
    },
  },
};
</script>







         
<template>
  <div class="Update">
    <v-subheader
      class="py-0 d-flex justify-space-between rounded-lg grey--text"
    >
      <h2>Update Resturant</h2>
    </v-subheader>
    <br />
    <v-row class="mt-2">
      <v-col lg="12">
        <v-card>
          <v-card-title>
            <span class="text-h5">Update Data About My Resturant</span>
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
                @click.prevent="updateResturant()"
                rounded
              >
                Update
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { computed, reactive } from "vue";
import axios from "axios";
import indexLayoutVue from "@/layouts/indexLayout.vue";
export default {
  created() {
    this.$emit("update:layout", indexLayoutVue);
  },
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
    userId: "",
    LocationError: "",
    LocationSuccess: "",
    LocationId: "",
    LocationData: [],
  }),
  mounted() {
    let user = localStorage.getItem("users");
    if (!user) {
      this.$router.push("/");
    } else {
      this.userId = JSON.parse(user).id;
      this.LocationId = this.$route.params.LocationId;
      this.CanAccess();
    }
  },
  methods: {
    async CanAccess() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.LocationId}&userId=${this.userId}`,
        { name: this.name, email: this.email, password: this.password }
      );
      if (result.status == 200 && result.data.length > 0) {
        this.LocationData = result.data;
        this.state.name = this.LocationData[0].name;
        this.state.addres = this.LocationData[0].addres;
        this.state.phone = this.LocationData[0].phone;
      } else {
        this.$router.push("/");
      }
    },
    async updateResturant() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.put(
          `http://localhost:3000/locations/${this.LocationId}`,
          {
            name: this.state.name,
            phone: this.state.phone,
            addres: this.state.addres,
            userId: this.userId,
          }
        );
        if (result.status == 200) {
          this.LocationSuccess = "Resturant Updated Succesfully";
          setTimeout(() => {
            this.state.name = "";
            this.state.phone = "";
            this.state.addres = "";
            this.LocationError = "";
            this.LocationSuccess = "";
            this.v$.name.$errors[0].$message = "";
            this.v$.addres.$errors[0].$message = "";
            this.v$.phone.$errors[0].$message = "";
            this.$router.push("/");
          }, 2000);
        } else {
          this.LocationError = "Resturant Updated Failed";
        }
      } else {
        this.LocationError = "Resturant Updated Failed";
      }
    },
  },
};
</script>

<template>
  <div class="Update">
    <v-subheader
      class="py-0 d-flex justify-space-between rounded-lg grey--text"
    >
      <h2>Update Catygory</h2>
    </v-subheader>
    <br />
    <v-row class="mt-2">
      <v-col lg="12">
        <v-card>
          <v-card-title>
            <span class="text-h5">Update Data About This Catygory</span>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="form">
              <v-text-field
                v-model="state.name"
                label="Catygory Name"
                prepend-icon="mdi-rename-box"
              ></v-text-field>
              <span class="red--text" v-if="v$.name.$error">{{
                v$.name.$errors[0].$message
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
                @click.prevent="updateCategory()"
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
import { required } from "@vuelidate/validators";
import { computed, reactive } from "vue";
import indexLayoutVue from "@/layouts/indexLayout.vue";
import { mapMutations, mapState } from "vuex";
import axios from "axios";
export default {
  created() {
    this.$emit("update:layout", indexLayoutVue);
  },
  setup() {
    const state = reactive({
      name: "",
    });
    const rules = computed(() => {
      return {
        name: { required },
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
    locationId: "",
    categoryId: "",
    LocationError: "",
    LocationSuccess: "",
    listofCategories: [],
  }),
  computed: {
    ...mapState(["isLoggedInUserId"]),
  },
  async mounted() {
    let user = localStorage.getItem("users");
    if (!user) {
      this.$router.push("/login");
    } else {
      this.userId = JSON.parse(user).id;
      this.locationId = this.$route.params.locationId;
      this.categoryId = this.$route.params.categoryId;
      let result = await axios.get(
        `http://localhost:3000/categories?id=${this.categoryId}&userId=${this.userId}&locationId=${this.locationId}`,
        { name: this.name }
      );
      if (result.status == 200) {
        this.state.name = result.data[0].name;
      }
      this.CanUserAccessToCategory({
        userIds: this.userId,
        locationIds: this.locationId,
        categoryIds: this.categoryId,
        redirectToPage: "Resturants",
      });
      this.listOfCategoriesFun(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations([
      "CanUserAccessToCategory",
      "CanUserAccess",
      "isLoggedInUserFun",
      "allCategories",
    ]),
    // async CanAccess() {
    //   let result = await axios.get(
    //     `http://localhost:3000/categories?id=${this.categoryId}&userId=${this.userId}&locationId=${this.locationId}`,
    //     { name: this.name }
    //   );
    //   if (result.status == 200 && result.data.length > 0) {
    //     this.LocationData = result.data;
    //     if (this.LocationData.length > 0) {
    //       this.state.name = this.LocationData[0].name;
    //     }
    //   } else {
    //     this.$router.go(-3);
    //   }
    // },
    async updateCategory() {
      this.v$.$validate();
      let filterData = this.listofCategories.filter(
        (x) => x.name.toLocaleLowerCase() == this.state.name.toLocaleLowerCase()
      );

      if (!this.v$.$error) {
        if (filterData.length > 0) {
          this.LocationError = "Catygory Name already exist..!";
          setTimeout(() => {
            this.LocationSuccess = "";
            this.LocationError = "";
          }, 2000);
        } else {
          let result = await axios.put(
            `http://localhost:3000/categories/${this.categoryId}`,
            {
              name: this.state.name,
              userId: this.userId,
              locationId: this.locationId,
            }
          );
          if (result.status == 200) {
            this.LocationSuccess = "Category Updated Succesfully";
            setTimeout(() => {
              this.state.name = "";
              this.LocationError = "";
              this.LocationSuccess = "";
              this.v$.name.$errors[0].$message = "";
              this.$router.go(-1);
            }, 2000);
          } else {
            this.LocationError = "Category Updated Failed";
          }
        }
      } else {
        this.LocationError = "You Must Fill This Field";
      }
    },
    async listOfCategoriesFun(userId, locationId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locationId}`
      );
      if (result.status == 200) {
        this.listofCategories = result.data;
      }
    },
  },
};
</script>



<template>
  <div class="Update">
    <v-subheader
      class="py-0 d-flex justify-space-between rounded-lg grey--text"
    >
      <h2>
        Categories Of
        <strong class="teal--text mx-1">{{ this.locationName }}</strong>
        Resturant ({{ listofCategories.length }})
      </h2>
      <v-spacer></v-spacer>
      <v-btn
        outlined
        rounded
        small
        color="teal darken-3"
        class="mr-1"
        @click="dialog = true"
      >
        <v-icon class="mr-1">mdi-plus-circle-multiple-outline</v-icon>
        <span> Add Catygory</span>
      </v-btn>
      <v-btn
        outlined
        rounded
        color="red darken-3"
        class="mr-1"
        small
        v-if="listofCategories.length > 1"
        @click="dialog3 = true"
      >
        <v-icon class="mr-1">mdi-delete-empty</v-icon>
        <span> Delete All</span>
      </v-btn>
    </v-subheader>

    <br />
    <v-row class="mt-2 mb-3">
      <v-col lg="12">
        <v-card class="mr-4 mb-15 pb-2" v-if="listofCategories.length > 0">
          <v-card-title class="justify-center">
            <h3>
              All Categories Of
              <strong class="teal--text mx-1">{{ this.locationName }}</strong>
            </h3>
          </v-card-title>
          <v-card-text
            ><v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center font-weight-black">Name</th>
                    <th class="text-center font-weight-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(cat, index) in listofCategories" :key="index">
                    <td class="text-center">{{ cat.name }}</td>

                    <td class="text-center">
                      <v-btn
                        fab
                        class="mr-1"
                        small
                        text
                        :to="{
                          name: 'UpdateCatygory',
                          params: {
                            categoryId: cat.id,
                            locationId: cat.locationId,
                          },
                        }"
                      >
                        <v-icon color="primary"> mdi-tooltip-edit</v-icon>
                      </v-btn>

                      <v-btn
                        fab
                        class="mr-1"
                        small
                        text
                        @click.prevent="showDialog(cat.id)"
                      >
                        <v-icon color="red"> mdi-delete-sweep</v-icon>
                      </v-btn>
                      <v-btn
                        fab
                        class="mr-1"
                        small
                        text
                        :to="{
                          name: 'ItemsCategory',
                          params: {
                            categoryId: cat.id,
                            locationId: cat.locationId,
                          },
                        }"
                      >
                        <v-icon color="green"> mdi-eye</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table></v-card-text
          >
        </v-card>
        <v-alert
          icon="mdi-shield-lock-outline"
          prominent
          text
          type="info"
          v-else
        >
          No Categories Yet...!!
        </v-alert>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5"
            >Add New Catygory To
            <strong class="primary--text mr-1">{{ this.locationName }}</strong>
            Resturant
          </span>
        </v-card-title>
        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field
              label="Catygory Name"
              prepend-icon="mdi-rename-box"
              v-model="state.name"
            ></v-text-field>
            <span class="red--text ma-1" v-if="v$.name.$error">{{
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
              rounded
              @click.prevent="addCatygory()"
            >
              Add Now
            </v-btn>
            <v-btn color="red darken-1" text rounded @click.prevent="close()">
              close
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog2" persistent max-width="350">
      <v-card>
        <v-card-title
          >Are You Sure To Delete
          <strong class="primary--text mx-1">{{ categoryName }}</strong>
          Category?</v-card-title
        >
        <v-divider class="mx-2 mt-4"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="DeleteCategory()" rounded>
            Delete
          </v-btn>
          <v-btn color="red darken-1" text @click="dialog2 = false" rounded>
            Cancle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog3" persistent max-width="450">
      <v-card>
        <v-card-title
          >Are You Sure To Delete All Categories from
          <strong class="teal--text mx-1">{{ this.locationName }}</strong
          >..?</v-card-title
        >
        <v-divider class="mx-2 mt-4"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="DeleteAllCategories()"
            rounded
          >
            Delete
          </v-btn>
          <v-btn color="red darken-1" text @click="dialog3 = false" rounded>
            Cancle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import indexLayoutVue from "@/layouts/indexLayout.vue";
import { mapMutations, mapState } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { computed, reactive } from "vue";
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
        name: { required, minLength: minLength(3) },
      };
    });
    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
    };
  },
  async mounted() {
    let user = localStorage.getItem("users");
    if (!user) {
      this.$router.push("/");
    } else {
      this.userId = JSON.parse(user).id;
      this.userName = JSON.parse(user).name;
      this.isLoggedInUserFun();
      this.locationId = this.$route.params.locationID;
      this.getLocationName();
      this.CanUserAccess({
        userIds: this.userId,
        locationIds: this.locationId,
        redirectToPage: "Resturants",
      });
      this.listOfCategoriesFun(this.userId, this.locationId);
      this.AllIDCategoriesInThisLocationFun(this.userId, this.locationId);
      this.AllIDItemsInThisLocationFun(this.userId, this.locationId);
    }
  },
  data() {
    return {
      userId: "",
      userName: "",
      locationId: "",
      locationName: "",
      dialog: false,
      LocationError: "",
      LocationSuccess: "",
      dialog2: false,
      dialog3: false,
      categoryName: "",
      categoryId: "",
      listofCategories: [],
      listIdOfItems: [],
      AllIDItemsInThisLocation: [],
      AllIDCategoriesInThisLocation: [],
    };
  },
  computed: {
    ...mapState([
      "isLoggedInUser",
      "loggedInUserNumberCatygory",
      "listOfCatygory",
      "isLoggedInUserId",
    ]),
  },
  methods: {
    ...mapMutations(["isLoggedInUserFun", "allCategories", "CanUserAccess"]),
    async getLocationName() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.locationId}`
      );
      if (result.status == 200) {
        this.locationName = result.data[0].name;
      }
    },
    async addCatygory() {
      this.v$.$validate();
      let filterData = this.listofCategories.filter(
        (x) => x.name.toLocaleLowerCase() == this.state.name.toLocaleLowerCase()
      );
      if (!this.v$.$error) {
        if (filterData.length > 0) {
          this.LocationSuccess = "";
          this.LocationError = "Catygory  already exist..!";
        } else {
          let result = await axios.post(`http://localhost:3000/categories`, {
            name: this.state.name,
            userId: this.userId,
            locationId: this.locationId,
          });
          if (result.status == 201) {
            this.LocationSuccess = "Catygory Added Successfully..!";
            this.LocationError = "";
            setTimeout(() => {
              this.dialog = false;

              location.reload();
            }, 1000);
          } else {
            this.LocationSuccess = "";
            this.LocationError = "There Are Somethin Wrong..!";
          }
        }
      } else {
        this.LocationSuccess = "";
        this.LocationError = "You Must Fill Catygory Name..!";
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
    async AllIDCategoriesInThisLocationFun(userId, locationId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locationId}`
      );
      let resultLength = result.data.length;

      for (let i = 0; i < resultLength; i++) {
        this.AllIDCategoriesInThisLocation.push(result.data[i].id);
      }
    },
    async AllIDItemsInThisLocationFun(userId, locationId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&locationId=${locationId}`
      );
      let resultLength = result.data.length;

      for (let i = 0; i < resultLength; i++) {
        this.AllIDItemsInThisLocation.push(result.data[i].id);
      }
    },
    close() {
      this.dialog = false;
    },
    async showDialog(val) {
      let result = await axios.get(
        `http://localhost:3000/categories?id=${val}`
      );
      if (result.status == 200) {
        this.categoryName = result.data[0].name;
        this.categoryId = result.data[0].id;
        let result2 = await axios.get(
          `http://localhost:3000/items?categoryId=${this.categoryId}`
        );
        let resultLength = result2.data.length;
        for (let i = 0; i < resultLength; i++) {
          this.listIdOfItems.push(result2.data[i].id);
        }
      }
      this.dialog2 = true;
    },
    async DeleteCategory() {
      let AllResults = [];
      for (let i = 0; i < this.listIdOfItems.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.listIdOfItems[i]}`
        );
        if (result.status == 200) {
          AllResults.push(true);
        } else {
          AllResults.push(false);
        }
      }
      let result2 = await axios.delete(
        `http://localhost:3000/categories/${this.categoryId}`
      );
      if (result2.status == 200) {
        setTimeout(() => {
          this.dialog2 = false;
          location.reload();
        }, 1000);
      } else {
        console.log("category Not deleted");
      }
    },
    async DeleteAllCategories() {
      let AllItemsResults = [];
      for (let i = 0; i < this.AllIDItemsInThisLocation.length; i++) {
        let result2 = await axios.delete(
          `http://localhost:3000/items/${this.AllIDItemsInThisLocation[i]}`
        );
        if (result2.status == 200) {
          AllItemsResults.push(true);
        } else {
          AllItemsResults.push(false);
        }
      }
      let AllCatResults = [];
      for (let i = 0; i < this.AllIDCategoriesInThisLocation.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/categories/${this.AllIDCategoriesInThisLocation[i]}`
        );
        if (result.status == 200) {
          AllCatResults.push(true);
        } else {
          AllCatResults.push(false);
        }
      }
      if (!AllItemsResults.includes(false) && !AllCatResults.includes(false)) {
        setTimeout(() => {
          this.dialog3 = false;
          location.reload();
        }, 1000);
      }
    },
  },
};
</script>

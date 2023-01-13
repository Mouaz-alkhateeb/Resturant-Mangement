<template>
  <div>
    <v-card class="mr-4 mb-15 pb-2" v-if="allResturants.length > 0">
      <v-card-title>
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="8" class="text-center">
            All Resturants ({{ allResturants.length }})
          </v-col>
          <v-col cols="6" md="4">
            <v-btn
              rounded
              outlined
              class="ml-10"
              color="red accent-4"
              @click="showAll()"
              small
            >
              <v-icon class="mr-1">mdi-delete-empty</v-icon> Delete All
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center font-weight-black">Name</th>
              <th class="text-center font-weight-black">Addres</th>
              <th class="text-center font-weight-black">Phone</th>
              <th class="text-center font-weight-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(loc, index) in allResturants" :key="index">
              <td class="text-center">{{ loc.name }}</td>
              <td class="text-center">{{ loc.addres }}</td>
              <td class="text-center">{{ loc.phone }}</td>
              <td class="text-center">
                <v-btn
                  fab
                  class="mr-1"
                  small
                  text
                  :to="{
                    name: 'Update-Location',
                    params: { LocationId: loc.id },
                  }"
                >
                  <v-icon color="primary"> mdi-tooltip-edit</v-icon>
                </v-btn>

                <v-btn
                  fab
                  class="mr-1"
                  small
                  text
                  @click.prevent="showDialog(loc.id)"
                >
                  <v-icon color="red"> mdi-delete-sweep</v-icon>
                </v-btn>
                <v-btn
                  fab
                  class="mr-1"
                  small
                  text
                  :to="{
                    name: 'Resturant-Category',
                    params: { locationID: loc.id },
                  }"
                >
                  <v-icon color="green"> mdi-eye</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <v-alert icon="mdi-shield-lock-outline" prominent text type="info" v-else>
      No Resturants Yet...!!
    </v-alert>
    <v-dialog v-model="dialog" persistent max-width="350">
      <v-card>
        <v-card-title>
          Are You Sure About Delete
          <strong class="primary--text mr-1">{{ locationName }}</strong>
          Resturant?
        </v-card-title>
        <v-divider class="mx-2 mt-4"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteResturant()" rounded>
            Delete
          </v-btn>
          <v-btn color="red darken-1" text @click="dialog = false" rounded>
            Cancle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog2" persistent max-width="350">
      <v-card>
        <v-card-title>
          Are You Sure About Delete All Resturants({{
            allResturants.length
          }})..?
        </v-card-title>
        <v-divider class="mx-2 mt-4"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteAll()" rounded>
            Delete
          </v-btn>
          <v-btn color="red darken-1" text @click="dialog2 = false" rounded>
            Cancle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userId: "",
      locationId: "",
      locationName: "",
      allResturants: [],
      AllIDItemsInThisLocation: [],
      AllIDCategoriesInThisLocation: [],
      AllIDForAllResturants: [],

      allIdCatForThisCat: [],
      allIdItemForThisCat: [],
      dialog: false,
      dialog2: false,
    };
  },
  async mounted() {
    let user = localStorage.getItem("users");
    this.userId = JSON.parse(user).id;
    let result = await axios.get(
      `http://localhost:3000/locations?userId=${this.userId}`
    );
    let resultLength = result.data.length;
    for (let i = 0; i < resultLength; i++) {
      this.allResturants.push(result.data[i]);
      this.AllIDForAllResturants.push(result.data[i].id);
    }
    let result1 = await axios.get(
      `http://localhost:3000/categories?userId=${this.userId}`
    );
    let resultLength1 = result1.data.length;
    for (let i = 0; i < resultLength1; i++) {
      this.AllIDCategoriesInThisLocation.push(result1.data[i].id);
    }
    let result2 = await axios.get(
      `http://localhost:3000/items?userId=${this.userId}`
    );
    let resultLength2 = result2.data.length;

    for (let i = 0; i < resultLength2; i++) {
      this.AllIDItemsInThisLocation.push(result2.data[i].id);
    }
  },
  methods: {
    async showDialog(val) {
      let result0 = await axios.get(
        `http://localhost:3000/locations?id=${val}`
      );
      if (result0.status == 200) {
        this.locationId = result0.data[0].id;
        this.locationName = result0.data[0].name;
        this.dialog = true;
        let result1 = await axios.get(
          `http://localhost:3000/categories?userId=${this.userId}&locationId=${this.locationId}`
        );
        let resultLength = result1.data.length;
        for (let i = 0; i < resultLength; i++) {
          this.allIdCatForThisCat.push(result1.data[i].id);
        }
        let result2 = await axios.get(
          `http://localhost:3000/items?userId=${this.userId}&locationId=${this.locationId}`
        );
        let resultLength2 = result2.data.length;

        for (let i = 0; i < resultLength2; i++) {
          this.allIdItemForThisCat.push(result2.data[i].id);
        }
      }
    },
    async deleteResturant() {
      let AllItemsResults = [];
      for (let i = 0; i < this.allIdItemForThisCat.length; i++) {
        let result2 = await axios.delete(
          `http://localhost:3000/items/${this.allIdItemForThisCat[i]}`
        );
        if (result2.status == 200) {
          AllItemsResults.push(true);
        } else {
          AllItemsResults.push(false);
        }
      }
      let AllCatResults = [];
      for (let i = 0; i < this.allIdCatForThisCat.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/categories/${this.allIdCatForThisCat[i]}`
        );
        if (result.status == 200) {
          AllCatResults.push(true);
        } else {
          AllCatResults.push(false);
        }
      }
      if (!AllItemsResults.includes(false) && !AllCatResults.includes(false)) {
        let result = await axios.delete(
          `http://localhost:3000/locations/${this.locationId}`
        );
        if (result.status == 200) {
          setTimeout(() => {
            this.dialog = false;
            location.reload();
          }, 1000);
        }
      }
    },
    showAll() {
      this.dialog2 = true;
    },
    async deleteAll() {
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
      let AllResResults = [];
      for (let i = 0; i < this.AllIDForAllResturants.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/locations/${this.AllIDForAllResturants[i]}`
        );
        if (result.status == 200) {
          AllResResults.push(true);
        } else {
          AllResResults.push(false);
        }
      }

      if (
        !AllItemsResults.includes(false) &&
        !AllCatResults.includes(false) &&
        !AllResResults.includes(false)
      ) {
        setTimeout(() => {
          this.dialog2 = false;
          location.reload();
        }, 1000);
      }
    },
  },
};
</script>

<style>
</style>
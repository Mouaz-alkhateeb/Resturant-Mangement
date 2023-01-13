<template>
  <div class="Update">
    <v-subheader
      class="py-0 d-flex justify-space-between rounded-lg grey--text"
    >
      <h2>
        Items Of
        <strong class="teal--text mx-1">{{ this.categoryName }}</strong>
        Category ({{ listIdOfItems.length }})
      </h2>

      <v-spacer></v-spacer>
      <v-btn
        outlined
        rounded
        small
        color="teal darken-3"
        class="mr-1"
        @click.prevent="opendialog()"
      >
        <v-icon class="mr-1">mdi-plus-circle-multiple-outline</v-icon>
        <span> Add Item</span>
      </v-btn>
      <v-btn
        outlined
        rounded
        color="red darken-3"
        class="mr-1"
        small
        @click="dialog = true"
        v-if="listIdOfItems.length > 0"
      >
        <v-icon class="mr-1">mdi-delete-empty</v-icon>
        <span> Delete All</span>
      </v-btn>
    </v-subheader>
    <br />
    <v-row class="mt-2 mb-3">
      <v-col lg="12">
        <v-card class="mr-4 mb-15 pb-2" v-if="listIdOfItems.length > 0">
          <v-card-title> </v-card-title>
          <v-card-text
            ><v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center font-weight-black">Name</th>
                    <th class="text-center font-weight-black">Price</th>
                    <th class="text-center font-weight-black">Description</th>
                    <th class="text-center font-weight-black">Qty</th>
                    <th class="text-center font-weight-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in listIdOfItems" :key="index">
                    <td class="text-center">{{ item.name }}</td>
                    <td class="text-center">{{ convertNumber(item.price) }}</td>
                    <td class="text-center">{{ item.description }}</td>
                    <td class="text-center">{{ item.qty }}</td>
                    <td class="text-center">
                      <v-btn
                        fab
                        class="mr-1"
                        small
                        text
                        :to="{
                          name: 'UpdateItem',
                          params: {
                            itemId: item.id,
                            categoryId: item.categoryId,
                            locationId: item.locationId,
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
                        @click.prevent="showDialog3(item.id)"
                      >
                        <v-icon color="red"> mdi-delete-sweep</v-icon>
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
          No Items Yet...!!
        </v-alert>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title
          >Are You Sure To Delete All Items from
          <strong class="teal--text mx-1">{{ this.categoryName }}</strong>
          Category ({{ listIdOfItems.length }}) ..?
        </v-card-title>
        <v-divider class="mx-2 mt-4"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click.prevent="deleteAll()"
            rounded
          >
            Delete
          </v-btn>
          <v-btn color="red darken-1" text @click="dialog = false" rounded>
            Cancle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog2" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5"
            >Add New Item To
            <strong class="primary--text mr-1">{{ this.categoryName }}</strong>
            Category
          </span>
        </v-card-title>
        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field
              v-model="state.name"
              label="Item Name"
              prepend-icon="mdi-rename-box"
            ></v-text-field>
            <span class="red--text ma-1" v-if="v$.name.$error">{{
              v$.name.$errors[0].$message
            }}</span>
            <v-text-field
              v-model="state.price"
              label="Item Price"
              type="number"
              prepend-icon="mdi-currency-usd"
            ></v-text-field>
            <span class="red--text ma-1" v-if="v$.price.$error">{{
              v$.price.$errors[0].$message
            }}</span>
            <v-text-field
              v-model="state.description"
              label="Item Description"
              prepend-icon="mdi-book-open-page-variant"
            ></v-text-field>
            <span class="red--text ma-1" v-if="v$.description.$error">{{
              v$.description.$errors[0].$message
            }}</span>
            <v-text-field
              v-model="state.qty"
              label="Item Quantities"
              prepend-icon="mdi-format-list-checks"
              type="number"
            ></v-text-field>
            <span class="red--text ma-1" v-if="v$.qty.$error">{{
              v$.qty.$errors[0].$message
            }}</span>

            <br />
            <v-alert
              class="mt-2"
              dense
              outlined
              type="error"
              v-if="itemError.length > 0"
            >
              {{ itemError }}
            </v-alert>
            <v-alert
              class="mt-2"
              dense
              text
              type="success"
              v-if="itemSuccess.length > 0"
            >
              {{ itemSuccess }}
            </v-alert>
            <br />
            <v-btn
              color="blue darken-1"
              text
              rounded
              @click.prevent="addItem()"
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
    <v-dialog v-model="dialog3" persistent max-width="400">
      <v-card>
        <v-card-title
          >Are You Sure To Delete
          <strong class="teal--text mx-1">{{ this.ItemName }}</strong>
          Item from Category ..?
        </v-card-title>
        <v-divider class="mx-2 mt-4"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click.prevent="deleteItem()"
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
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required, between } from "@vuelidate/validators";
import { computed, reactive } from "vue";

export default {
  created() {
    this.$emit("update:layout", indexLayoutVue);
  },
  setup() {
    const state = reactive({
      name: "",
      price: "",
      description: "",
      qty: "",
    });
    const rules = computed(() => {
      return {
        name: { required },
        price: { required, between: between(1, 1000000) },
        description: { required },
        qty: { required, between: between(1, 100000) },
      };
    });
    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
    };
  },
  data() {
    return {
      categoryId: "",
      categoryName: "",
      locationId: "",
      ItemName: "",
      ItemId: "",
      dialog: false,
      dialog2: false,
      dialog3: "",
      itemError: "",
      itemSuccess: "",
      listIdOfItems: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("users");
    if (!user) {
      this.$router.push("/");
    } else {
      this.userId = JSON.parse(user).id;
      this.userName = JSON.parse(user).name;
      this.categoryId = this.$route.params.categoryId;
      this.locationId = this.$route.params.locationId;
      this.getNameCategory();
      let result = await axios.get(
        `http://localhost:3000/items?categoryId=${this.categoryId}&userId=${this.userId}&locationId=${this.locationId}`
      );
      if (result.status == 200) {
        let resultLength = result.data.length;
        for (let i = 0; i < resultLength; i++) {
          this.listIdOfItems.push(result.data[i]);
        }
      } else {
        this.$router.push("/");
      }
    }
  },
  methods: {
    async getNameCategory() {
      let result = await axios.get(
        `http://localhost:3000/categories?id=${this.categoryId}`
      );
      if (result.status == 200) {
        this.categoryName = result.data[0].name;
      }
    },

    async deleteAll() {
      let AllResults = [];
      for (let i = 0; i < this.listIdOfItems.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.listIdOfItems[i].id}`
        );
        if (result.status == 200) {
          AllResults.push(true);
          this.dialog = false;
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          AllResults.push(false);
        }
      }
    },
    opendialog() {
      this.dialog2 = true;
    },
    async addItem() {
      this.v$.$validate();
      let filterData = this.listIdOfItems.filter(
        (x) => x.name.toLocaleLowerCase() == this.state.name.toLocaleLowerCase()
      );
      if (!this.v$.$error) {
        if (filterData.length > 0) {
          this.itemSuccess = "";
          this.itemError = "Item  already exist..!";
        } else {
          let result = await axios.post(`http://localhost:3000/items`, {
            name: this.state.name,
            price: parseFloat(this.state.price).toFixed(2),
            description: this.state.description,
            qty: this.state.qty,
            userId: this.userId,
            locationId: this.locationId,
            categoryId: this.categoryId,
          });
          if (result.status == 201) {
            this.itemSuccess = "Item Added Successfully..!";
            this.itemError = "";
            setTimeout(() => {
              this.dialog2 = false;
              location.reload();
            }, 1000);
          } else {
            this.itemSuccess = "";
            this.itemError = "There Are Somethin Wrong..!";
          }
        }
      } else {
        this.itemSuccess = "";
        this.itemError = "You Must Fill Catygory Name..!";
      }
    },
    close() {
      this.dialog2 = false;
    },
    convertNumber(n) {
      return n.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    },
    async showDialog3(val) {
      let result = await axios.get(`http://localhost:3000/items?id=${val}`);
      if (result.status == 200) {
        this.ItemName = result.data[0].name;
        this.ItemId = result.data[0].id;
      }
      this.dialog3 = true;
    },
    async deleteItem() {
      let result = await axios.delete(
        `http://localhost:3000/items/${this.ItemId}`
      );
      if (result.status == 200) {
        setTimeout(() => {
          this.dialog3 = false;
          location.reload();
        }, 1000);
      }
    },
  },
};
</script>

<template>
  <div class="Update">
    <v-subheader
      class="py-0 d-flex justify-space-between rounded-lg grey--text"
    >
      <h2>
        Update <strong class="teal--text">{{ this.state.name }}</strong> Item
      </h2>
    </v-subheader>
    <br />
    <v-row class="mt-2">
      <v-col lg="12">
        <v-card>
          <v-card-title>
            <span class="text-h5">Update Data About This Item</span>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="form">
              <v-text-field
                v-model="state.name"
                label="Item Name"
                prepend-icon="mdi-rename-box"
              ></v-text-field>
              <span class="red--text" v-if="v$.name.$error">{{
                v$.name.$errors[0].$message
              }}</span>

              <v-text-field
                v-model="state.price"
                label="Item Price"
                type="number"
                prepend-icon="mdi-currency-usd"
              ></v-text-field>
              <span class="red--text" v-if="v$.price.$error">{{
                v$.price.$errors[0].$message
              }}</span>
              <v-text-field
                v-model="state.description"
                label="Item Description"
                prepend-icon="mdi-book-open-page-variant"
              ></v-text-field>
              <span class="red--text" v-if="v$.description.$error">{{
                v$.description.$errors[0].$message
              }}</span>
              <v-text-field
                v-model="state.qty"
                label="Item Quantities"
                prepend-icon="mdi-format-list-checks"
                type="number"
              ></v-text-field>
              <span class="red--text" v-if="v$.qty.$error">{{
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
                @click.prevent="update()"
              >
                update
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import indexLayoutVue from "@/layouts/indexLayout.vue";
import useVuelidate from "@vuelidate/core";
import { required, between } from "@vuelidate/validators";
import { computed, reactive } from "vue";
import axios from "axios";
import { mapMutations } from "vuex";
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
  data: () => ({
    userId: "",
    locationId: "",
    categoryId: "",
    categoryName: "",
    itemId: "",
    itemSuccess: "",
    itemError: "",
  }),
  async mounted() {
    let user = localStorage.getItem("users");
    if (!user) {
      this.$router.push("/");
    } else {
      this.userId = JSON.parse(user).id;
      this.locationId = this.$route.params.locationId;
      this.categoryId = this.$route.params.categoryId;
      this.itemId = this.$route.params.itemId;
      this.getDataForThisItem();
      this.CanUserAccessToItem({
        userIds: this.userId,
        locationIds: this.locationId,
        itemIds: this.itemId,
        redirectToPage: "Resturants",
      });
    }
  },
  methods: {
    ...mapMutations(["CanUserAccessToItem"]),
    async getDataForThisItem() {
      let result = await axios.get(
        `http://localhost:3000/items?id=${this.itemId}&userId=${this.userId}&locationId=${this.locationId}&categoryId=${this.categoryId}`
      );
      if (result.status == 200) {
        this.state.name = result.data[0].name;
        this.state.price = result.data[0].price;
        this.state.description = result.data[0].description;
        this.state.qty = result.data[0].qty;
      }
    },
    async update() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.put(
          `http://localhost:3000/items/${this.itemId}`,
          {
            name: this.state.name,
            price: this.state.price,
            description: this.state.description,
            qty: this.state.qty,
            locationId: this.locationId,
            categoryId: this.categoryId,
            userId: this.userId,
          }
        );
        if (result.status == 200) {
          this.itemSuccess = "Item Updated Succesfully";
          setTimeout(() => {
            this.state.name = "";
            this.state.price = "";
            this.state.description = "";
            this.state.qty = "";
            this.itemSuccess = "";
            this.itemError = "";
            this.v$.name.$errors[0].$message = "";
            this.v$.price.$errors[0].$message = "";
            this.v$.description.$errors[0].$message = "";
            this.v$.qty.$errors[0].$message = "";
            this.$router.go(-1);
          }, 2000);
        } else {
          this.itemError = "Item Updated Failed";
        }
      } else {
        this.itemError = "You Must Fill This Field";
      }
    },
  },
};
</script>



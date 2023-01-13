<template>
  <div class="dashboard">
    <v-subheader
      class="py-0 d-flex justify-space-between rounded-lg grey--text"
    >
      <h2>All Resturants</h2>
      <v-spacer></v-spacer>
      <pop-up />
    </v-subheader>
    <br />
    <v-row class="mt-2">
      <v-col lg="12">
        <all-location />
        <!-- <all-location :AllLocation="listOfLocations" /> -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
//import axios from "axios";
import PopUp from "../components/PopUp.vue";
import indexLayout from "../layouts/indexLayout.vue";
import AllLocation from "@/components/AllLocation.vue";
export default {
  components: { PopUp, AllLocation },
  data() {
    return {
      userId: "",
      listOfLocations: [],
    };
  },
  created() {
    this.$emit("update:layout", indexLayout);
  },
  async mounted() {
    let user = localStorage.getItem("users");
    if (!user) {
      this.$router.push("/login");
    } else {
      this.userId = JSON.parse(user).id;
    }
  },
};
</script>

<style scoped>
.overlap-icon {
  position: absolute;
  top: -33px;
  text-align: center;
  padding-top: 12px;
}
</style>
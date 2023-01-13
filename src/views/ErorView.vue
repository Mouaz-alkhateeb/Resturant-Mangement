<template>
  <div class="text-center mt-15">
    <div class="text-center">
      <h1 class="mr-2 mb-8">
        PAGE NOT FOUND(404)..!!
        <v-btn rounded color="rgb(13,66,255) " dark to="/"> Go Back </v-btn>
      </h1>
    </div>
    <v-row class="justify-center">
      <v-img src="../assets/hero.svg" max-width="50%" max-height="60%"></v-img>
    </v-row>
  </div>
</template>

<script>
import LoginLayout from "../layouts/LoginLayout.vue";
export default {
  created() {
    this.$emit("update:layout", LoginLayout);
  },
};
</script>


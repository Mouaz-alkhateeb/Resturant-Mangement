<template>
  <v-app id="inspire">
    <v-main class="grey lighten-4"
      ><component :is="layout">
        <v-container> <router-view :layout.sync="layout" /> </v-container>
      </component>
    </v-main>
  </v-app>
</template>

<script>
export default {
  components: {},
  data: () => ({
    layout: "div",
  }),
};
</script>

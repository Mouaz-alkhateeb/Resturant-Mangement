<template>
  <div>
    <bar-app />
    <slot />
    <footer-app />
  </div>
</template>

<script>
import BarApp from "../components/BarApp.vue";
import FooterApp from "../components/FooterApp.vue";

export default {
  components: { BarApp, FooterApp },
};
</script>
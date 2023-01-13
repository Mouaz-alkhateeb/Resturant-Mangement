<template>
  <nav>
    <v-app-bar app elevate-on-scroll fixed>
      <v-app-bar-nav-icon @click="drawer = !drawer"> </v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">Project Title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="grey" rounded @click="logout()">
        <span>log-out</span>
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" dark>
      <v-img
        height="160"
        class="pa-4"
        src="https://images.unsplash.com/photo-1532210317995-cc56d90177d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0NTMzNXwwfDF8c2VhcmNofDE5fHxiYWNrZ3JvdW5kfGVufDB8fHx8MTY3MDg3MDI4MQ&ixlib=rb-4.0.3&q=80&w=200"
      >
        <div class="text-center">
          <v-avatar class="ma-4" color="grey darken-1" size="80">
            <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" />
          </v-avatar>
          <h2 class="white--text">{{ username }}</h2>
        </div>
      </v-img>

      <v-divider></v-divider>

      <v-list rounded>
        <v-list-item
          v-for="[icon, text, route] in links"
          :key="icon"
          link
          :to="route"
        >
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>
<script>
export default {
  data() {
    return {
      username: "",
      drawer: true,
      links: [
        ["mdi-food-fork-drink", "Resturants", "/"],
        ["mdi-account", "Profile", "/profile"],
        ["mdi-login", "Login", "/login"],
      ],

      items: [
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
          title: "Brunch this weekend?",
          subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: `<span class="text--primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
          title: "Oui oui",
          subtitle:
            '<span class="text--primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
          title: "Birthday gift",
          subtitle:
            '<span class="text--primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
        },
        { divider: true, inset: true },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
          title: "Recipe to try",
          subtitle:
            '<span class="text--primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
        },
      ],
    };
  },
  mounted() {
    let user = localStorage.getItem("users");
    this.username = JSON.parse(user).name;
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>
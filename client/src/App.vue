<template>
  <v-app>
    <!-- Horizontal NavBar -->
    <v-toolbar fixed color="primary" dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">
          VueShare
        </router-link>  
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search Input -->
      <v-text-field flex prepend-icon="search" placeholder="Search Posts" color="white" single-line hide-details></v-text-field>

      <v-spacer></v-spacer>

      <!-- Horizontal nav bar links -->
      <v-toolbar-items>
        <v-btn flat v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- App content -->
    <main>
      <router-view/>
    </main>
  </v-app>
</template>

<script>
  export default {
    name: "App",
    computer: {
      horizontalNavItems() {
        return [
          { icon: 'chat', title: 'Posts', link: '/posts' },
          { icon: 'lock_open', title: 'Sign In', link: '/signin' },
          { icon: 'create', title: 'Sign Up', link: '/signup' }
        ]
      }
    }
  }
</script>


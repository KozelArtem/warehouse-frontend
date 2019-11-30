<template>
  <v-app>
    <AppHeader />
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

import AppHeader from './components/helpers/AppHeader.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
  },
};
</script>

<style lang="scss">
.pointer {
  cursor: pointer;
}
</style>

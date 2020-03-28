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
};
tr, .v-toolbar__title {
  .show-on-hover {
    display: none;
  }
  &:hover {
    .show-on-hover {

      display: inline;
    }
  }
}

.w-200 {
  width: 200px;
}

.w-100 {
  width: 100px;
}

input[type="button"]{
  outline: none !important;
}

</style>

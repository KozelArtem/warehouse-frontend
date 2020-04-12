<template>
  <v-app>
    <AppHeader />
    <v-content>
      <router-view/>
    </v-content>
    <v-bottom-sheet left :value="alert.show" inset hide-overlay @input="closeAlert">
      <v-alert
        text
        dismissible
        class="ma-0"
        border="left"
        :type="alert.type"
        :value="alert.show"
        @input="closeAlert"
      >
        {{ alert.message }}
      </v-alert>
    </v-bottom-sheet>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import AppHeader from './components/helpers/AppHeader.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
  },
  computed: {
    ...mapGetters(['alert']),
  },
  methods: {
    ...mapMutations({ closeAlert: 'CLOSE_ALERT' }),
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

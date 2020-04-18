<template>
  <v-card color="teal lighten-4" flat tile>
    <v-toolbar dense color="teal">
      <v-spacer />
      <v-btn v-if="!isLoggedIn" outlined small @click="$router.push('/login')" dark>
        Войти
      </v-btn>
       <v-btn v-else outlined small @click="signOut" dark>
        Выйти
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { AUTH_NAMESPACE } from '../../store/namespaces';

export default {
  computed: {
    ...mapGetters(AUTH_NAMESPACE, ['isLoggedIn']),
  },

  methods: {
    ...mapActions(AUTH_NAMESPACE, ['logout']),

    signOut() {
      this.logout();
      this.$router.push('/login');
    },
  },
};
</script>

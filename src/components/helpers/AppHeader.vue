<template>
  <v-card color="teal lighten-4" flat tile>
    <v-toolbar dense color="teal darken-3">
      <!-- <v-toolbar-title class="mr-5 ml-2 white--text">MPP</v-toolbar-title> -->
      <v-toolbar-items v-if="isLoggedIn">
        <v-tooltip bottom color="teal"
          nudge-bottom="-20" v-for="item in menu" :key="item.id">
          <template v-slot:activator="{ on }">
            <router-link :to="item.link" v-slot="{ isExactActive, navigate }">
              <v-icon
                :class="['px-1', { 'px-3': $vuetify.breakpoint.smAndUp }]"
                medium
                :color="isExactActive ? 'deep-orange accent-2' : 'white'"
                v-on="on"
                @click="navigate"
              >
                {{ item.icon }}
              </v-icon>
            </router-link>
          </template>
          <span class="white--text">{{ item.title }}</span>
        </v-tooltip>
      </v-toolbar-items>
      <v-spacer />
      <v-icon v-if="!isLoggedIn" color="green" icon @click="signIn" dark>mdi-login</v-icon>
      <v-icon v-else color="red" class="mr-4" icon @click="signOut" dark>mdi-logout</v-icon>
    </v-toolbar>
  </v-card>
</template>

<script>
import api from '../../api';

const {
  isLoggedIn,
} = api;

export default {
  data: () => ({
    menu: [
      {
        id: 0,
        link: '/',
        icon: 'mdi-calendar',
        title: 'Заказы',
      },
      {
        id: 1,
        link: '/warehouse',
        icon: 'mdi-warehouse',
        title: 'Склад',
      },
      {
        id: 2,
        link: '/equipments',
        icon: 'mdi-printer-settings',
        title: 'Оборудование и техника',
      },
      {
        id: 3,
        link: '/tools',
        icon: 'mdi-hammer-wrench',
        title: 'Инструменты',
      },
      {
        id: 4,
        link: '/waybill',
        icon: 'mdi-file',
        title: 'Накладные',
      },
      {
        id: 5,
        link: '/distribution',
        icon: 'mdi-bulldozer',
        title: 'Журнал работ',
      },
      {
        id: 6,
        link: '/company',
        icon: 'mdi-domain',
        title: 'Компании',
      },
      // {
      //   id: 7,
      //   link: '/',
      //   icon: 'mdi-book-search',
      //   title: 'Дневник',
      // },
    ],
  }),

  computed: {
    isLoggedIn() {
      return isLoggedIn();
    },
  },

  methods: {
    signIn() {
      this.$router.push('/login');
    },

    signOut() {
      localStorage.removeItem('token');
      window.location.reload(true);
    },
  },
};
</script>

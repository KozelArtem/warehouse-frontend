<template>
  <div v-if="isLoggedIn">
    <v-app-bar
      id="appToolbar"
      dense
      clipped-left
      app
      light
      color="white"
      flat
    >
      <v-app-bar-nav-icon @click="updateVisible"></v-app-bar-nav-icon>
      <v-toolbar-title></v-toolbar-title>
      <v-spacer></v-spacer>
      <SearchWithDropdown />
      <v-spacer></v-spacer>
      <v-btn color="red" @click="signOut()" icon>
        <v-icon>mdi-exit-run</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-if="isLoggedIn"
      :mini-variant="mini"
      mobile-break-point="900"
      clipped
      app
      class="elevation-10"
      v-model="visible"
    >
      <v-list nav dense>
        <v-list-item-group v-model="item" color="primary">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.link" exact>
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { AUTH_NAMESPACE } from '../../store/namespaces';

export default {
  components: {
    SearchWithDropdown: () => import('../helpers/SearchWithDropdown.vue'),
  },

  data: () => ({
    visible: true,
    mini: false,
    item: 0,
    items: [
      { link: '/', icon: 'mdi-calendar', title: 'Заказы' },
      { link: '/warehouse', icon: 'mdi-warehouse', title: 'Склад' },
      { link: '/equipments', icon: 'mdi-printer-settings', title: 'Оборудование и техника' },
      { link: '/tools', icon: 'mdi-hammer-wrench', title: 'Инструменты' },
      { link: '/waybill', icon: 'mdi-file', title: 'Накладные' },
      { link: '/machines', icon: 'mdi-bulldozer', title: 'Журнал работ' },
      { link: '/machines/to', icon: 'mdi-tools', title: 'График ТО' },
      { link: '/company', icon: 'mdi-domain', title: 'Компании' },
      { link: '/repairItems', icon: 'mdi-cog-box', title: 'Валы на реставрацию' },
    ],

    showSearch: false,
    search: '',
  }),

  computed: {
    ...mapGetters(AUTH_NAMESPACE, ['isLoggedIn']),
  },

  methods: {
    ...mapActions(AUTH_NAMESPACE, ['logout']),

    updateVisible() {
      if (this.visible && this.$vuetify.breakpoint.smAndUp) {
        this.mini = !this.mini;
      } else {
        this.visible = !this.visible;
      }
    },

    signOut() {
      this.logout();
      this.$router.push('/login');
    },
  },
};
</script>

<template>
  <v-navigation-drawer
    :mini-variant="mini"
    :expand-on-hover="mini && $vuetify.breakpoint.smAndUp"
    fixed
    app
    :value="true"
    permanent
    stateless
  >
    <v-toolbar color="teal" dark dense>
      <v-app-bar-nav-icon @click="mini = !mini"></v-app-bar-nav-icon>
      <v-toolbar-title>MPP</v-toolbar-title>
    </v-toolbar>

    <v-list nav dense v-if="isLoggedIn">
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
</template>

<script>
import { mapGetters } from 'vuex';

import { AUTH_NAMESPACE } from '../../store/namespaces';

export default {
  data: () => ({
    mini: true,
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
    ],
  }),

  computed: {
    ...mapGetters(AUTH_NAMESPACE, ['isLoggedIn']),
  },
};
</script>

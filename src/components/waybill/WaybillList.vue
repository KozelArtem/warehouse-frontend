<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <v-dialog
          v-model="newWaybillDialog"
          scrollable fullscreen
          persistent no-click-animation
          transition="dialog-transition"
        >
          <v-card>
            <v-card-title class="purple white--text darken-3">
              <span class="headline">Добавление накладной</span>
              <v-spacer></v-spacer>
              <v-icon color="red" @click="newWaybillDialog = false">mdi-close</v-icon>
            </v-card-title>
            <v-card-text>
              <WaybillForm @submit="onWaybillFormSubmit"/>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-flex xs12>
        <v-toolbar class="elevation-3 purple darken-2">
          <v-toolbar-title class="white--text">Накладные</v-toolbar-title>
          <v-spacer></v-spacer>

          <span :class="['d-flex', {
            'w-200': $vuetify.breakpoint.smAndUp,
            'w-100': $vuetify.breakpoint.xs,
            }
          ]">
            <v-text-field prepend-icon="mdi-magnify"
              dark dense label="Поиск"
              hide-details v-model="search"></v-text-field>
          </span>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon color="green" dark @click="newWaybillDialog = true">mdi-plus-circle</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs6 sm4 md3 lg2 v-for="waybill in items" :key="waybill.id">
        <v-card class="elevation-5 pa-2 pointer" @click="selectRow(waybill)">
          <div class="overflow-hidden subtitle-2 text-truncate">
            {{ waybill.number }}
          </div>
          <v-card-subtitle class="subtitle-2 pa-0">{{ waybill.date }}</v-card-subtitle>
        </v-card>
      </v-flex>

      <router-view></router-view>
    </v-layout>
  </v-container>
</template>

<script>
import api from '../../api';

import { format as formatDate } from '../../helpers/dates';

const { getWaybillList } = api;

export default {
  components: {
    WaybillForm: () => import('./WaybillForm.vue'),
    // WaybillInfo: () => import('./WaybillInfo.vue'),
  },

  data: () => ({
    newWaybillDialog: false,

    items: [],
    search: null,
    waybills: [],
  }),

  beforeMount() {
    this.loadWaybills();
  },

  watch: {
    search() {
      const searchValue = this.search.trim();

      this.items = this.waybills.filter(waybill => waybill.number.includes(searchValue));
    },
  },

  methods: {
    async loadWaybills() {
      const data = await getWaybillList();

      this.waybills = data.map(value => ({ ...value, date: formatDate(value.date) }));
      this.items = this.waybills;
    },

    selectRow(waybill) {
      this.$router.push({ name: 'waybillInfo', params: { id: waybill.id } });
    },

    onWaybillFormSubmit() {
      this.newWaybillDialog = false;
      this.loadWaybills();
    },
  },
};
</script>

<style lang="scss">
.w-200 {
  width: 200px;
}

.w-100 {
  width: 100px;
}

.aaaa {
  text-overflow: ellipsis;
  overflow: hidden;
  width: 160px;
  height: 1.2em;
  white-space: nowrap;
}
</style>

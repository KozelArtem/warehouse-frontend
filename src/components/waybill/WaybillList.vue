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
        <v-toolbar dark color="purple darken-2">
          <v-toolbar-title v-if="$vuetify.breakpoint.smAndUp">Накладные</v-toolbar-title>
          <v-spacer></v-spacer>
          <span :class="['d-flex', {
            'w-200': $vuetify.breakpoint.smAndUp,
            'w-100': $vuetify.breakpoint.xs,
            }
          ]">
            <v-text-field dark append-icon="mdi-magnify"
              dense label="Поиск"
              hide-details v-model="search"></v-text-field>
          </span>
        </v-toolbar>
        <v-divider></v-divider>
        <v-progress-linear
          :active="loading"
          indeterminate
          color="purple darken-2"
          height="7px"
          opacity="0.3"
        ></v-progress-linear>
      </v-flex>
      <v-flex xs12>
        <MonthTabs :value="selectedMonthId" @change="month => selectedMonthId = month" />
      </v-flex>
      <v-flex xs12>
        <v-simple-table
          fixed-header
          dense
          class="elevation-10 inner"
        >
          <template v-slot:default>
            <tbody>
              <tr v-for="company in localItems" :key="`company${company.id}`">
                <td>{{ company.name }}</td>
                <td v-for="i in waybillsCount" :key="`waybill${company.id}-${i}`">
                  <WaybillCard
                    v-if="company.waybills[i - 1]"
                    :waybill="company.waybills[i - 1]"
                  />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-flex>
      <router-view></router-view>
    </v-layout>
    <v-btn
      v-if="isAdmin()"
      small
      fixed
      dark
      fab
      bottom
      right
      color="purple darken-2"
      @click="newWaybillDialog = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import moment from 'moment';

import api from '../../api';

const { getWaybillList, isAdmin } = api;

export default {
  components: {
    MonthTabs: () => import('../helpers/MonthTabs.vue'),
    WaybillForm: () => import('./WaybillForm.vue'),
    WaybillCard: () => import('./WaybillCard.vue'),
  },

  data: () => ({
    newWaybillDialog: false,

    loading: false,

    selectedMonthId: moment().month(),

    items: [],
    waybillsCount: 1,
    search: '',
  }),

  beforeMount() {
    this.loadWaybills();
  },

  computed: {
    localItems() {
      return (this.items || [])
        .filter(item => !!item)
        .sort((a, b) => b.waybills.length - a.waybills.length)
        .map((item) => {
          const waybills = item.waybills
            .filter((waybill) => {
              if (this.search.trim()) {
                return waybill.number.includes(this.search);
              }

              return true;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          return {
            ...item,
            waybills,
          };
        });
    },
  },

  watch: {
    selectedMonthId() {
      this.loadWaybills();
    },
  },

  methods: {
    isAdmin,
    async loadWaybills() {
      this.loading = true;

      const query = {
        dateFrom: moment().month(this.selectedMonthId).startOf('month'),
        dateTo: moment().month(this.selectedMonthId).endOf('month'),
        byCompany: true,
      };

      const { data } = await getWaybillList(query);

      this.items = data;
      this.waybillsCount = this.items[0].waybills.length;
      this.loading = false;
    },

    onWaybillFormSubmit() {
      this.newWaybillDialog = false;
      this.loadWaybills();
    },
  },
};
</script>

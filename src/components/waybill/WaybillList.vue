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
          <v-toolbar-title>Накладные</v-toolbar-title>
          <v-divider vertical class="mx-4"></v-divider>
          <span class="d-flex w-100">
            <v-select
              class="mx-2"
              :items="months"
              v-model="selectedMonthId"
              dense
              dark
              hide-details
            ></v-select>
          </span>
          <span class="d-flex w-100">
            <v-divider vertical class="mx-2"></v-divider>
            <v-select
              :items="years"
              v-model="selectedYearId"
              dense
              dark
              hide-details
            ></v-select>
          </span>
          <v-spacer></v-spacer>
          <span v-if="$vuetify.breakpoint.smAndUp" :class="['d-flex', {
            'w-200': $vuetify.breakpoint.smAndUp,
            'w-100': $vuetify.breakpoint.xs,
            }
          ]">
            <v-text-field dark append-icon="mdi-magnify"
              dense label="Поиск"
              hide-details v-model="search"></v-text-field>
          </span>
        </v-toolbar>
        <v-progress-linear
          :active="loading"
          indeterminate
          color="purple darken-2"
          height="7px"
          opacity="0.3"
        ></v-progress-linear>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs12>
        <v-alert type="info" :value="showAlert" class="text-center">
          Нет накладных за выбранный период
        </v-alert>
        <v-simple-table
          fixed-header
          dense
          class="elevation-10 inner"
        >
          <template v-slot:default>
            <tbody>
              <tr v-for="company in localItems" :key="`company${company.id}`">
                <td width="300px">{{ company.name }}</td>
                <td class="pa-0"
                  v-for="i in waybillsCount"
                  :key="`waybill${company.id}-${i}`"
                  width="150px">
                  <WaybillCard
                    v-if="company.waybills[i - 1]"
                    :waybill="company.waybills[i - 1]"
                  />
                </td>
                <td></td>
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
    WaybillForm: () => import('./WaybillForm.vue'),
    WaybillCard: () => import('./WaybillCard.vue'),
  },

  data: () => ({
    newWaybillDialog: false,

    loading: false,

    selectedMonthId: moment().month(),
    selectedYearId: moment().year(),

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
    months() {
      return moment.months().map((month, i) => ({
        text: month,
        value: i,
      }));
    },
    years() {
      const years = [];
      const dateStart = moment().subtract(1, 'y');
      const dateEnd = moment();

      while (dateEnd.diff(dateStart, 'years') >= 0) {
        years.push(dateStart.year());
        dateStart.add(1, 'year');
      }

      return years;
    },
    showAlert() {
      return !this.items.length;
    },
  },

  watch: {
    selectedMonthId() {
      this.loadWaybills();
    },
    selectedYearId() {
      this.loadWaybills();
    },
  },

  methods: {
    isAdmin,
    async loadWaybills() {
      this.loading = true;

      const query = {
        dateFrom: moment().year(this.selectedYearId).month(this.selectedMonthId).startOf('month'),
        dateTo: moment().year(this.selectedYearId).month(this.selectedMonthId).endOf('month'),
        byCompany: true,
      };

      const { data } = await getWaybillList(query);

      this.items = data;
      this.waybillsCount = ((this.items[0] || {}).waybills || []).length;
      this.loading = false;
    },

    onWaybillFormSubmit() {
      this.newWaybillDialog = false;
      this.loadWaybills();
    },
  },
};
</script>

<template>
  <div>
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
        <Toolbar
          title="Накладные"
          color="orange"
          :loading="loading"
          @search="updateSearch"
        />
        <v-btn block color="primary" @click="datePicker = !datePicker">
          Период {{ period.join(' ~ ') }}
        </v-btn>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs12 lg3 v-if="datePicker">
        <v-date-picker
          v-model="dateRange"
          type="month"
          color="black"
          :max="today"
          landscape
          full-width
          no-title
          multiple
          range
        ></v-date-picker>
      </v-flex>
      <v-flex :lg12="!datePicker" :lg9="datePicker" xs12>
        <v-alert type="info" dense :value="showAlert" class="text-center">
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
  </div>
</template>

<script>
import moment from 'moment';

import api from '../../api';

const { getWaybillList, isAdmin } = api;

export default {
  components: {
    Toolbar: () => import('../helpers/Toolbar.vue'),
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

    today: moment().format(),

    datePicker: false,
    dateRange: [moment().format('YYYY-MM')],
  }),

  beforeMount() {
    this.loadWaybills();
  },

  computed: {
    period() {
      return this.dateRange.slice(0).sort((a, b) => moment(a).diff(moment(b)));
    },

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
    period() {
      this.loadWaybills();
    },
  },

  methods: {
    isAdmin,
    async loadWaybills() {
      this.loading = true;

      const query = {
        dateFrom: this.period[0],
        dateTo: this.period[1],
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

    updateSearch(search) {
      this.search = search;
    },
  },
};
</script>

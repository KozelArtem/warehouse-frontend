<template>
  <div>
    <router-view></router-view>
    <v-layout row wrap v-if="viewMode">
      <v-flex xs12>
        <Toolbar
          title="Накладные"
          color="white"
          :loading="isLoading"
          @search="updateSearch"
        />
        <v-menu offset-y left bottom :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn block color="primary" v-on="on">
              Период {{ period.join(' ~ ') }}
            </v-btn>
          </template>
          <v-date-picker
            v-model="dateRange"
            type="month"
            color="black"
            :max="today"
            landscape
            no-title
            multiple
            range
          ></v-date-picker>
        </v-menu>

        <v-divider></v-divider>
      </v-flex>
      <v-flex xs12>
        <v-alert type="info" dense :value="showAlert" class="text-center">
          Нет накладных за выбранный период
        </v-alert>
        <v-simple-table
          fixed-header
          dense
          class="elevation-10"
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
      v-if="isAdmin && viewMode"
      small
      fixed
      dark
      fab
      bottom
      right
      color="purple darken-2"
      @click="$router.push('waybill/add')"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

import { WAYBILL_NAMESPACE, AUTH_NAMESPACE } from '../../store/namespaces';

export default {
  components: {
    Toolbar: () => import('../helpers/Toolbar.vue'),
    WaybillCard: () => import('./WaybillCard.vue'),
  },

  data: () => ({
    items: [],
    search: '',

    today: moment().format(),

    dateRange: [moment().format('YYYY-MM')],
  }),

  beforeMount() {
    this.loadWaybills();
  },

  computed: {
    ...mapGetters(AUTH_NAMESPACE, ['isAdmin']),
    ...mapGetters(WAYBILL_NAMESPACE, ['isLoading', 'waybillList']),

    viewMode() {
      return this.$route.path === '/waybill';
    },

    period() {
      return this.dateRange.slice(0).sort((a, b) => moment(a).diff(moment(b)));
    },

    localItems() {
      return (this.waybillList || [])
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
        })
        .filter(item => item.waybills.length);
    },

    showAlert() {
      return !this.waybillList.length;
    },

    waybillsCount() {
      return (this.waybillList[0] && this.waybillList[0].waybills.length) || 1;
    },
  },

  watch: {
    period() {
      this.loadWaybills();
    },
  },

  methods: {
    ...mapActions(WAYBILL_NAMESPACE, ['fetchWaybills']),

    async loadWaybills() {
      const [start, end] = this.period;
      const query = {
        dateFrom: moment(start).startOf('month').format(),
        dateTo: moment(end || start).endOf('month').format(),
        byCompany: true,
      };

      this.fetchWaybills(query);
    },

    updateSearch(search) {
      this.search = search;
    },
  },
};
</script>

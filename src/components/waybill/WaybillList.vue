<template>
  <div>
    <router-view></router-view>
    <v-layout row wrap v-if="viewMode">
      <v-flex xs12>
        <Toolbar
          title="Накладные"
          :loading="isLoading"
          @search="updateSearch"
        >
          <template v-slot:afterTitle>
            <DateRangePickerButton color="primary" buttonColor="white" v-model="period" />
          </template>
        </Toolbar>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs12 style="overflow: auto">
        <v-alert type="info" dense :value="showAlert" class="text-center">
          Нет накладных за выбранный период
        </v-alert>
        <v-simple-table
          fixed-header
          dense
          style="max-height: 84vh;"
          class="elevation-10 fixed-table__wrapper"
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
    DateRangePickerButton: () => import('../helpers/DateRangePickerButton.vue'),
    WaybillCard: () => import('./WaybillCard.vue'),
  },

  data: () => ({
    items: [],
    search: '',

    period: [moment().format('YYYY-MM')],
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
      const [dateFrom, dateTo] = this.period;
      const query = {
        dateFrom,
        dateTo,
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

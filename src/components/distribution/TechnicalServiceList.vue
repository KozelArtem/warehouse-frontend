<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex xs12>
        <v-toolbar color="orange lighten-2">
          <v-toolbar-title>График ТО</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-flex>
      <v-flex xs12>
        <v-simple-table
          fixed-header
          dense
          class="elevation-10"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th width="40%" class="fixed text-center orange lighten-4 body-2 font-weight-bold">
                  Наименование
                </th>
                <th
                  class="orange lighten-4 text-center body-2 font-weight-bold"
                  v-for="i in PERIOR_IN_MONTHS"
                  :key="i"
                  :width="`${60 / PERIOR_IN_MONTHS}%`"
                >
                  {{ getMonth(i) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(machine) in machines"
                :key="machine.id"
              >
              <td class="fixed">
                <router-link :to="`./${machine.id}`">
                  {{machine.name}}
                </router-link>
              </td>
              <td
                v-for="month in 12"
                :key="`machine${month}`"
                class="text-center"
                :class="machine.servicesByMonth[month].class"
              >
                <span v-if="!machine.servicesByMonth[month].updatable">
                  {{ machine.servicesByMonth[month].day }}
                </span>
                <v-menu
                  v-else
                  v-model="machine.servicesByMonth[month].completedAtPicker"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn block text small v-on="on">
                      {{ machine.servicesByMonth[month].day }}
                    </v-btn>
                  </template>
                  <v-date-picker
                    color="green accent-4"
                    first-day-of-week="1"
                    v-model="machine.servicesByMonth[month].completedAt"
                    @input="updateService(machine.servicesByMonth[month])"
                    :max="today"
                    locale="ru-RU"
                    />
                  </v-menu>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import moment from 'moment';
import api from '../../api';

const {
  loadMachines,
  updateMachineService,
} = api;

export default {
  data: vm => ({
    PERIOR_IN_MONTHS: 12,
    today: moment().format(),

    loading: true,
    machines: [],

    startMonth: 1,
    endMonth: vm.PERIOR_IN_MONTHS,
  }),

  beforeMount() {
    this.loadData();
  },

  methods: {
    getMonth(i) {
      return moment().month(i - 1).format('MMM');
    },

    formatService(service) {
      if (!service) {
        return {
          ...service,
          completedAtPicker: false,
          class: 'pointer',
          day: '',
          updatable: true,
        };
      }

      if (service.completedAt) {
        return {
          ...service,
          completedAtPicker: false,
          class: 'color-green',
          day: moment(service.completedAt).format('DD'),
          updatable: false,
        };
      }

      if (service.addedAt && moment(service.addedAt).isAfter(moment())) {
        return {
          ...service,
          completedAtPicker: false,
          class: 'color-yellow pointer',
          day: moment(service.addedAt).format('DD'),
          updatable: true,
        };
      }

      return {
        ...service,
        completedAtPicker: false,
        class: 'color-red pointer',
        day: moment(service.addedAt).format('DD'),
        updatable: true,
      };
    },

    formatMachine(machine) {
      const servicesByMonth = machine.services.reduce((acc, service) => {
        const month = moment(service.completedAt || service.addedAt).month();

        acc[month + 1] = this.formatService(service);

        return acc;
      }, {});

      new Array(this.PERIOR_IN_MONTHS).fill(0).forEach((_, i) => {
        servicesByMonth[i + 1] = servicesByMonth[i + 1] || {};
      });

      return {
        ...machine,
        servicesByMonth,
      };
    },

    async loadData() {
      this.loading = true;

      const query = {
        dateFrom: moment().set('month', this.startMonth),
        dateTo: moment().set('month', this.endMonth),
        onlyTO: true,
        limit: 100,
        offset: 0,
      };

      const response = await loadMachines(query);

      this.machines = response.data.map(this.formatMachine);
      this.loading = false;
    },

    async updateService(service) {
      await updateMachineService(service.machineId, service.id, service);

      this.loadData();
    },

  },
};
</script>

<style lang="scss" scoped>
td {
  border-right: 1px solid black;
  border-bottom: 1px solid black !important;
}

.color-green {
  background-color: lightgreen;
}

.color-red {
  color: white;
  background-color: #ff000085;
}

.color-yellow {
  color: black;
  background-color: yellow;
}
</style>

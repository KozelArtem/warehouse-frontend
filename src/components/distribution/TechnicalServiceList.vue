<template>
  <div>
    <v-simple-table
      fixed-header
      dense
      class="elevation-10"
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th width="40%" class="fixed text-center orange lighten-4">Наименование</th>
            <th
              class="orange lighten-4 text-center"
              v-for="i in 6"
              :key="i"
              width="10%"
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
            v-for="(month, i) in 6"
            :key="`machine${month}`"
            class="text-center"
            :class="getTOForMonth(machine, i).color"
          >
            <span>
              {{ getTOForMonth(machine, i).day }}
            </span>
          </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>

import moment from 'moment';
import api from '../../api';

const {
  loadMachines,
} = api;

export default {
  data: () => ({
    loading: true,
    machines: [],

    startMonth: moment().month(),
    endMonth: moment().add(6, 'month').month(),
  }),

  beforeMount() {
    this.loadData();
  },

  methods: {
    getMonth(i) {
      return moment().month(i - 1).format('MMMM');
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

      this.machines = response.data;
      this.loading = false;
    },

    getTOForMonth(machine, month) {
      const service = (machine.services || [])
        .find(s => (moment(s.completedAt).month() || moment(s.addedAt).month()) === month);

      if (service && service.completedAt) {
        return {
          color: 'color-green',
          day: moment(service.completedAt).day(),
        };
      }

      if (service && service.addedAt) {
        return {
          color: 'color-red',
          day: moment(service.addedAt).day(),
        };
      }

      return {
        color: '',
        day: '',
      };
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
  background-color: red;
}
</style>

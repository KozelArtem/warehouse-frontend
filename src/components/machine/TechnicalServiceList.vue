<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <Toolbar
          title="График ТО"
          color="orange lighten-2"
          :showSearch="false"
          :loading="loading"
        >
          <template v-slot:afterTitle>
            <span class="d-flex w-100">
              <v-select
                label="Год"
                :items="years"
                v-model="selectedYear"
                dense
                hide-details
              ></v-select>
            </span>
          </template>
        </Toolbar>
      </v-flex>
      <v-flex xs12>
        <v-simple-table dense class="elevation-10 fixed-table__wrapper">
          <template v-slot:default>
            <thead>
              <tr>
                <th width="40%" class="fixed text-center body-2 font-weight-bold">
                  Наименование
                </th>
                <th
                  class="text-center body-2 font-weight-bold px-0"
                  v-for="i in PERIOD_IN_MONTHS"
                  :key="i"
                  :width="`${60 / PERIOD_IN_MONTHS}%`"
                >
                  {{ getMonth(i) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="machine in machineList" :key="machine.id">
              <td>
                <router-link :to="`./${machine.id}`" style="color: #D1E8E2">
                  {{machine.name}}
                </router-link>
              </td>
              <td
                v-for="month in 12"
                :key="`machine${month}`"
                class="text-center ma-0 pa-0"
                :class="machine.servicesByMonth[month].class"
              >
                <span v-if="!(machine.servicesByMonth[month].updatable && isAdmin)">
                  {{ machine.servicesByMonth[month].day }}
                </span>
                <DatePickerButton
                  v-else
                  :value="machine.servicesByMonth[month].completedAt"
                  :emptyDateText="machine.servicesByMonth[month].day"
                  bgColor="green accent-4"
                  @input="date => updateServiceCompletedDate(machine.servicesByMonth[month], date)"
                />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

import { AUTH_NAMESPACE, MACHINE_NAMESPACE } from '../../store/namespaces';
import { PERIOD_IN_MONTHS } from '../../helpers/machine';

export default {
  components: {
    Toolbar: () => import('../helpers/Toolbar.vue'),
    DatePickerButton: () => import('../helpers/DatePickerButton.vue'),
  },
  data: () => ({
    PERIOD_IN_MONTHS,
    selectedYear: moment().year(),
  }),

  beforeMount() {
    this.fetchTechnicalServices();
  },

  computed: {
    ...mapGetters(AUTH_NAMESPACE, ['isAdmin']),
    ...mapGetters(MACHINE_NAMESPACE, { machineList: 'technicalList', loading: 'isLoading' }),

    years() {
      const years = [];
      const dateStart = moment().subtract(2, 'y');
      const dateEnd = moment();

      while (dateEnd.diff(dateStart, 'years') >= 0) {
        years.push(dateStart.year());
        dateStart.add(1, 'year');
      }

      return years;
    },
  },

  watch: {
    selectedYear() {
      this.fetchTechnicalServices(this.selectedYear);
    },
  },

  methods: {
    ...mapActions(MACHINE_NAMESPACE, ['fetchTechnicalServices', 'updateTechnicalService']),

    getMonth: i => moment().month(i - 1).format('MMM'),

    updateServiceCompletedDate(service, date) {
      if (date) {
        const {
          id, machineId, name, addedAt,
        } = service;
        const data = {
          id,
          machineId,
          name,
          isTO: true,
          addedAt,
          completedAt: date,
        };
        this.updateTechnicalService(data);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.color-green {
  background-color: #14A76C;
}

.color-red {
  color: white;
  background-color: #FF652F;
}

.color-yellow {
  color: black;
  background-color: #FFE400;
}
</style>

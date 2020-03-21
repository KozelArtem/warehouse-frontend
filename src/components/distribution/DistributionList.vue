<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>
        <v-dialog
          v-model="newMachineModal"
          :overlay="false"
          max-width="500px"
          transition="dialog-transition"
        >
          <v-card>
            <v-card-title primary-title color="orange lighten-2">
              Добавление нового оборудования
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="newMachine.name"/>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outlined color="green" @click="createMachine()">Сохранить</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-toolbar color="orange lighten-2">
          <v-toolbar-title v-if="$vuetify.breakpoint.smAndUp">Журнал работ</v-toolbar-title>
          <v-spacer></v-spacer>
          <span :class="['d-flex', {
            'w-200': $vuetify.breakpoint.smAndUp,
            'w-100': $vuetify.breakpoint.xs,
            }
          ]">
            <v-text-field append-icon="mdi-magnify"
              dense label="Поиск"
              hide-details v-model="search"></v-text-field>
          </span>
        </v-toolbar>
        <v-divider></v-divider>
        <v-progress-linear
          :active="loading"
          indeterminate
          color="orange"
          height="7px"
          opacity="0.3"
        ></v-progress-linear>

        <v-simple-table
          fixed-header
          dense
          class="elevation-10"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  class="orange lighten-4"
                  v-for="header in headers"
                  :key="header.text"
                  :width="header.width"
                  v-show="header.breakpoint()"
                >
                  {{ header.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="pointer"
                v-for="(machine, i) in sortedMachines"
                :key="machine.id"
                @click="openInfo(machine)"
              >
                <td v-if="headers[0].breakpoint()">{{ i + 1 }}</td>
                <td>{{ machine.name }}</td>
                <td>{{ machine.services.length }}</td>
                <td>
                  {{ machine.lastServiceDate | date }} -- {{ machine.nextServiceDate | date }}
                </td>
              </tr>
            </tbody>
            <tfoot class="orange lighten-4">
              <tr>
                <td :colspan="headers.length">
                  <v-pagination
                    v-if="totalPages > 1"
                    bottom
                    color="orange lighten-2"
                    v-model="page"
                    :length="totalPages"
                    :total-visible="7"
                  ></v-pagination>
                </td>
              </tr>
            </tfoot>
          </template>
        </v-simple-table>
      </v-flex>
    </v-layout>
    <v-btn
      v-if="isAdmin()"
      small
      fixed
      dark
      fab
      bottom
      right
      color="orange lighten-2"
      @click="newMachineModal = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn
      small
      fixed
      fab
      bottom
      left
      @click="$router.push({ name: 'distributionTO' })"
    >
      <v-icon>mdi-tools</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import moment from 'moment';

import api from '../../api';
import { format as formatDate } from '../../helpers/dates';

const {
  loadMachines,
  createMachine,
  isAdmin,
} = api;

export default {
  data: vm => ({
    headers: [
      {
        text: '№',
        width: '5%',
        breakpoint: () => vm.$vuetify.breakpoint.smAndUp,
      },
      {
        text: 'Оборудование',
        width: '50%',
        breakpoint: () => true,
      },
      {
        text: 'Задачи',
        width: '15%',
        breakpoint: () => true,
      },
      {
        text: 'ТО',
        width: '30%',
        breakpoint: () => true,
      },
    ],
    machines: [],

    search: '',
    limit: 20,
    page: 1,
    totalPages: 1,

    newMachine: {
      name: '',
    },

    loading: true,

    newMachineModal: false,
    dialog: false,
  }),

  beforeMount() {
    this.loadMachines();
  },

  watch: {
    page() {
      this.loadMachines();
    },
    search() {
      this.page = 1;
      this.loadMachines();
    },
  },

  computed: {
    sortedMachines() {
      return this.machines.slice(0);
    },
  },

  methods: {
    isAdmin,
    formatDate,
    async loadMachines() {
      this.loading = true;

      const offset = this.limit * (this.page - 1);
      const query = {
        offset,
        limit: this.limit,
        search: this.search,
      };

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(async () => {
        this.loading = true;
        const { data, count } = await loadMachines(query);

        this.machines = data;
        this.totalPages = Math.ceil(+count / this.limit);
        this.loading = false;
      }, 300);
    },

    async createMachine() {
      if (!this.newMachine.name.trim()) {
        return;
      }

      await createMachine(this.newMachine);
      this.loadMachines();
      this.newMachineModal = false;
    },

    getLastTO(item) {
      const to = (item.services || [])
        .filter(service => service.isTO)
        .sort((a, b) => (new Date(b.completedDate) - new Date(a.completedDate) > 0 ? 1 : -1))[0];

      if (to) {
        return to.completedDate;
      }

      return '';
    },

    getNextTO(item) {
      const lastTO = this.getLastTO(item);

      if (lastTO) {
        return moment(lastTO).add(1, 'month');
      }

      return '';
    },

    openInfo(item) {
      this.$router.push({ name: 'distPlaceInfo', params: { id: item.id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.green-bg {
  background: rgba(0,255,0,0.3) !important;
}
</style>

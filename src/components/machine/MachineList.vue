<template>
  <div>
    <v-layout row wrap>
      <v-flex>
        <MachineForm
          :dialog="newMachineModal"
          @submit="onNewMachine"
          @close="newMachineModal = false"
        />
        <Toolbar
          title="Журнал работ"
          :loading="isLoading"
          @search="onSearchChange"
        />
        <v-simple-table
          fixed-header
          dense
          class="elevation-10 fixed-table__wrapper"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th
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
                v-for="(machine, i) in machineList"
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
            <TablePagination
              :totalPages="totalPages"
              :headersLength="headers.length"
              @change="pageChange"
            />
          </template>
        </v-simple-table>
      </v-flex>
    </v-layout>
    <v-btn
      v-if="isAdmin"
      small
      fixed
      dark
      fab
      bottom
      right
      color="blue lighten-2"
      @click="newMachineModal = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';

import { AUTH_NAMESPACE, MACHINE_NAMESPACE } from '../../store/namespaces';

export default {
  components: {
    MachineForm: () => import('./MachineForm.vue'),
    Toolbar: () => import('../helpers/Toolbar.vue'),
    TablePagination: () => import('../helpers/TablePagination.vue'),
  },
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

    query: {
      search: '',
      limit: 10,
      offset: 0,
    },

    page: 1,

    newMachineModal: false,
  }),

  beforeMount() {
    this.fetchMachines(this.query);
  },

  computed: {
    ...mapGetters(MACHINE_NAMESPACE, ['totalPages', 'machineList', 'isLoading']),
    ...mapGetters(AUTH_NAMESPACE, ['isAdmin']),
  },

  watch: {
    query: {
      deep: true,
      handler() {
        this.fetchMachines(this.query);
      },
    },
  },

  methods: {
    ...mapActions(MACHINE_NAMESPACE, ['fetchMachines', 'createMachine']),

    onSearchChange(search) {
      this.query.search = search;
    },

    getIndex(i) {
      return this.query.limit * (this.page - 1) + i + 1;
    },

    pageChange({ limit, offset, page }) {
      this.page = page;
      this.query = { ...this.query, limit, offset };
    },

    async onNewMachine(machine) {
      await this.createMachine(machine);

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
      this.$router.push({ name: 'machineInfo', params: { id: item.id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.green-bg {
  background: rgba(0,255,0,0.3) !important;
}
</style>

<template>
  <div>
    <DeleteModal
      v-if="deleteTask.dialog"
      :title="deleteTask.title"
      :description="deleteTask.description"
      @click="result => removeTask(deleteTask.task, result)"
    />
    <ServiceModal
      v-if="serviceModal.dialog"
      :machineId="id"
      :title="serviceModal.title"
      :data="serviceModal.data"
      @close="closeServiceModal"
      @submit="onServiceModalSubmit"
    />
    <v-layout row wrap>
      <v-flex xs12>
        <Toolbar
          :title="machine.name"
          color="orange lighten-2"
          :loading="isLoading"
        >
          <template v-slot:title>
            <v-text-field
              v-if="editing"
              v-model="machine.name"
              solo
              hide-details
              clearable
              append-outer-icon="mdi-check"
              @click:clear="editing = false"
              @click:append-outer="updateMachineName"
            />
            <v-hover v-else v-slot:default="{ hover }">
              <span>
                {{ machine.name }}
                <v-icon
                  v-if="isAdmin"
                  v-show="hover"
                  @click="editing = true"
                  color="gray" small
                >
                  mdi-lead-pencil
                </v-icon>
              </span>
            </v-hover>
          </template>
          <template v-slot:right>
            <span>
              <span class="body-2 font-weight-medium">
                <v-icon color="red">mdi-clock</v-icon>
                {{ machine.activeServicesCount || 0 }}
              </span>
              <v-divider></v-divider>
              <span class="body-2 font-weight-medium">
                <v-icon color="success">mdi-check-circle</v-icon>
                {{ machine.totalServicesCount || 0 }}
              </span>
            </span>
          </template>
        </Toolbar>
        <MonthTabs v-model="selectedMonthId" />
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs12>
        <v-simple-table fixed-header dense class="elevation-10">
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
                v-for="(service, i) in machineServices"
                :key="service.id"
                @contextmenu="value = true"
              >
                <td v-if="headers[0].breakpoint()">{{ i + 1 }}</td>
                <td>
                  {{ service.name }}
                  <span class="show-on-hover" v-if="isAdmin">
                    <v-icon @click="showUpdateServiceModal(service)" color="gray" small>
                      mdi-lead-pencil
                    </v-icon>
                  </span>
                </td>
                <td class="font-weight-bold">{{ service.addedAt | date }}</td>
                <td class="font-weight-bold">{{ service.completedAt | date }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-flex>
    </v-layout>
    <v-btn
      v-if="isAdmin"
      small fixed dark fab bottom
      right color="orange lighten-2"
      @click="showCreateServiceModal"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

import { MACHINE_NAMESPACE, AUTH_NAMESPACE } from '../../store/namespaces';

export default {
  components: {
    ServiceModal: () => import('./ServiceModal.vue'),
    Toolbar: () => import('../helpers/Toolbar.vue'),
    DeleteModal: () => import('../helpers/DeleteModal.vue'),
    MonthTabs: () => import('../helpers/MonthTabs.vue'),
  },

  props: {
    id: {
      type: [Number, String],
      required: true,
      default: 0,
    },
  },

  beforeMount() {
    this.loadMachineData();
  },

  data: vm => ({
    headers: [
      { text: '№', width: '5%', breakpoint: () => vm.$vuetify.breakpoint.smAndUp },
      { text: 'Название', width: '55%', breakpoint: () => true },
      { text: 'Дата добавления', width: '20%', breakpoint: () => true },
      { text: 'Дата выполнения', width: '20%', breakpoint: () => true },
    ],

    selectedMonthId: moment().month(),
    editing: false,

    serviceModal: {
      dialog: false,
      title: '',
      data: null,
    },

    deleteTask: {
      dialog: false,
      title: 'Удаление задачи',
      description: '',
      task: null,
    },
  }),

  computed: {
    ...mapGetters(AUTH_NAMESPACE, ['isAdmin']),
    ...mapGetters(MACHINE_NAMESPACE, ['isLoading', 'machine', 'machineServices']),
  },

  watch: {
    id() {
      this.loadMachineData();
    },

    selectedMonthId() {
      this.loadServices();
    },
  },

  methods: {
    ...mapActions(MACHINE_NAMESPACE, ['fetchMachineData', 'fetchMachineServices', 'updateMachine']),

    loadServices() {
      const query = {
        dateFrom: moment().month(this.selectedMonthId).startOf('month').format(),
        dateTo: moment().month(this.selectedMonthId).endOf('month').format(),
        onlyTO: false,
      };

      this.fetchMachineServices({ id: this.id, query });
    },

    loadMachineData() {
      this.fetchMachineData(this.id);
      this.loadServices();
    },

    showCreateServiceModal() {
      this.serviceModal = {
        dialog: true,
        title: 'Добавление новой задачи',
      };
    },

    showUpdateServiceModal(service) {
      this.serviceModal = {
        dialog: true,
        machineId: this.id,
        title: 'Редактирование задачи',
        data: { ...service },
      };
    },

    closeServiceModal() {
      this.serviceModal = { dialog: false };
    },

    onServiceModalSubmit() {
      this.selectedMonthId = moment().month();
      this.closeServiceModal();
    },

    updateMachineName() {
      this.updateMachine(this.machine);
      this.editing = false;
    },
  },
};
</script>

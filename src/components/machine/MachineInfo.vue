<template>
  <div>
    <DeleteModal
      v-if="deleteTask.dialog"
      :title="deleteTask.title"
      :description="deleteTask.description"
      @click="onRemoveModalResult"
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
          :title="localMachine.name"
          color="blue lighten-2"
          :loading="isLoading"
        >
          <template v-slot:title>
            <v-text-field
              v-if="editing"
              v-model="localMachine.name"
              solo
              hide-details
              clearable
              append-outer-icon="mdi-check"
              @click:clear="editing = false"
              @click:append-outer="updateMachineName"
            />
              <span class="headline font-weight-black">
                {{ localMachine.name }}
              </span>
          </template>
          <template v-slot:right>
            <DropdownMenu
              v-if="isAdmin"
              color="white"
              icon="mdi-dots-horizontal"
              :fields="menuFields"
              @create="showCreateServiceModal"
              @update="editing = true"
              @remove="showRemoveModal()"
            />
            <v-divider vertical class="mx-3"></v-divider>
            <div>
              <v-switch
                v-model="onlyCompleted"
                :label="`${localMachine.currentServicesCount} / ${localMachine.totalServicesCount}`"
                color="green"
                dense
                dark
                hide-details
              ></v-switch>
              <v-divider class="my-1"></v-divider>
              <v-switch
                v-model="onlyActive"
                :label="`${localMachine.activeServicesCount || 0}`"
                color="red"
                dense
                dark
                hide-details
              ></v-switch>
            </div>
          </template>
        </Toolbar>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs12>
        <v-simple-table
          fixed-header
          dense
          class="elevation-10 fixed-table__wrapper"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  class="subtitle-2 font-weight-bold blue lighten-4 black--text px-0 text-center"
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
                v-for="(service, i) in services"
                :key="service.id"
                @click="toggleView(service.id)"
              >
                <td v-if="headers[0].breakpoint()">
                  {{ i + 1 }}
                </td>
                <td :class="{ 'truncate': isActive(service.id) }" class="border-right">
                  <span>{{ service.name }}</span>
                  <span class="show-on-hover" v-if="isAdmin">
                    <v-icon @click.stop="showUpdateServiceModal(service)" color="gray" small>
                      mdi-lead-pencil
                    </v-icon>
                  </span>
                </td>
                <td :class="{ 'truncate': isActive(service.id) }" class="border-right">
                  {{ service.description }}</td>
                <td :class="{ 'truncate': isActive(service.id) }" class="border-right">
                  {{ service.diagnostic }}
                </td>
                <td :class="{ 'truncate': isActive(service.id) }" class="border-right">
                  {{ service.elimination }}
                </td>
                <td v-if="service.doneWorker">
                  {{ service.doneWorker.surname }} {{ service.doneWorker.name }}
                </td>
                <td v-else>
                </td>
                <td class="font-weight-bold">
                  <span>{{ service.addedAt | date }}</span>
                  <v-spacer></v-spacer>
                  <span v-if="service.completed" class="green--text">
                    {{ service.completedAt | date }}
                  </span>
                  <span v-else>...</span>
                </td>
              </tr>
            </tbody>
            <tfoot class="blue lighten-2">
              <TablePagination
                :totalPages="totalPages"
                :headersLength="headers.length - 1"
                color="blue"
                @change="pageChange"
              >
                <template v-slot:right>
                  <td>
                    <DateRangePickerButton
                      color="blue lighten-2"
                      buttonColor="white"
                      v-model="range"
                    />
                  </td>
                </template>
              </TablePagination>
            </tfoot>
          </template>
        </v-simple-table>
      </v-flex>
    </v-layout>

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
    DateRangePickerButton: () => import('../helpers/DateRangePickerButton.vue'),
    TablePagination: () => import('../helpers/TablePagination.vue'),
    DropdownMenu: () => import('../helpers/DropdownMenu.vue'),
  },

  props: {
    id: {
      type: [Number, String],
      required: true,
      default: 0,
    },
  },

  beforeMount() {
    this.fetchMachineData(this.id);
  },

  data: vm => ({
    ex7: false,
    onlyCompleted: false,
    onlyActive: true,
    active: null,
    headers: [
      { text: '№', width: '3%', breakpoint: () => vm.$vuetify.breakpoint.smAndUp },
      { text: 'Задача', width: '20%', breakpoint: () => true },
      { text: 'Описание', width: '20%', breakpoint: () => true },
      { text: 'Диагостика', width: '17%', breakpoint: () => true },
      { text: 'Устранение(выполнение)', width: '20%', breakpoint: () => true },
      { text: 'Выполнил', width: '10%', breakpoint: () => true },
      { text: 'Дата доб./вып.', width: '10%', breakpoint: () => true },
    ],

    menuFields: [
      'create',
      'update',
      'remove',
    ],

    range: [],
    limit: 10,
    offset: 0,

    editing: false,

    serviceModal: {
      dialog: false,
      title: '',
      data: null,
    },

    deleteTask: {
      dialog: false,
      title: 'Удаление',
      description: '',
      task: null,
    },
  }),

  computed: {
    ...mapGetters(AUTH_NAMESPACE, ['isAdmin']),
    ...mapGetters(MACHINE_NAMESPACE, ['isLoading', 'machine', 'machineServices', 'servicesTotalCount']),

    localMachine() {
      const active = this.machineServices.filter(i => !i.completed).length;

      return {
        ...this.machine,
        activeServicesCount: active,
        totalServicesCount: this.machine.totalServicesCount - active,
        currentServicesCount: this.machineServices.filter(i => i.completed).length,
      };
    },

    services() {
      return this.machineServices.slice(0).filter((i) => {
        if (this.onlyActive && this.onlyCompleted) {
          return true;
        }

        if (this.onlyActive) {
          return i.completed === false;
        }

        if (this.onlyCompleted) {
          return i.completed === true;
        }

        return false;
      });
    },

    totalPages() {
      return Math.ceil(this.servicesTotalCount / this.limit);
    },
  },

  watch: {
    range() {
      this.loadServices();
    },
  },

  methods: {
    ...mapActions(MACHINE_NAMESPACE, ['fetchMachineData', 'fetchMachineServices', 'updateMachine', 'removeMachine']),

    pageChange({ limit, offset, page }) {
      this.page = page;
      this.limit = limit;
      this.offset = offset;
      this.loadServices();
    },

    isActive(id) {
      return this.active !== id;
    },

    toggleView(id) {
      if (this.active === id) {
        this.active = null;
      } else {
        this.active = id;
      }
    },

    loadServices() {
      const [dateFrom, dateTo] = this.range;
      const query = {
        dateFrom,
        dateTo,
        onlyTO: false,
        limit: this.limit,
        offset: this.offset,
      };

      this.fetchMachineServices({ id: this.id, query });
    },

    showCreateServiceModal() {
      this.serviceModal = {
        dialog: true,
        title: 'Добавление',
      };
    },

    showUpdateServiceModal(service) {
      this.serviceModal = {
        dialog: true,
        machineId: this.id,
        title: 'Редактирование',
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

    showRemoveModal() {
      this.deleteTask = {
        title: `Удаление ${this.machine.name}`,
        description: `Вы действительно хотите удалить оборудование ${this.machine.name}, у которого ${this.localMachine.activeServicesCount} активных задач?`,
        dialog: true,
      };
    },

    onRemoveModalResult(result) {
      if (result) {
        this.removeMachine(this.machine.id);
        this.$router.push('/machines');
      }

      this.deleteTask = {
        dialog: false,
      };
    },
  },
};
</script>

<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex xs1>
        <v-dialog
          v-model="newTaskModal"
          persistent :overlay="false"
          max-width="500px"
          transition="dialog-transition"
        >
          <v-card>
            <v-card-title primary-title>
              Добавление новой задачи
            </v-card-title>
            <v-card-text>
              <v-text-field label="Название" v-model="task.name"></v-text-field>
              <DatePicker
                label="Дата добавления"
                @update="date => task.addedAt = date"
              />
              <v-switch
                v-model="task.isTO"
                label="TO"
              ></v-switch>
            </v-card-text>
            <v-card-actions>
              <v-btn color="error" @click="closeNewTaskModal()" text>Закрыть</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="createNewTask()" text>Добавить</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <DeleteModal
          :dialog="deleteTask.dialog"
          :title="deleteTask.title"
          :description="deleteTask.description"
          @click="result => removeTask(deleteTask.task, result)"
        />
      </v-flex>
      <v-flex xs12>
        <v-toolbar color="orange lighten-2">
          <v-toolbar-title>
            <v-text-field
              v-if="editing"
              v-model="item.name"
              solo
              dense
              hide-details
              clearable
              append-outer-icon="mdi-check"
              @click:clear="editing = false"
              @click:append-outer="updateMachine()"
            ></v-text-field>
            <span v-else>
              {{ item.name }}
              <span class="show-on-hover" v-if="isAdmin()">
                <v-icon @click="editing = true" color="gray" small>
                  mdi-lead-pencil
                </v-icon>
              </span>
            </span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <span>
            <span class="body-2 font-weight-medium">
              <v-icon color="red">mdi-clock</v-icon>
              {{ item.activeServicesCount || 0 }}
            </span>
            <v-divider></v-divider>
            <span class="body-2 font-weight-medium">
              <v-icon color="success">mdi-check-circle</v-icon>
              {{ item.totalServicesCount || 0 }}
            </span>
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
      </v-flex>
      <v-flex xs12>
        <v-tabs
          v-model="selectedMonthId"
          grow
          center-active
        >
          <v-tab
            v-for="month in months"
            :key="month"
            @change="selectedMonthId = month"
          >
            {{ month }}
          </v-tab>
        </v-tabs>
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
                v-for="(service, i) in item.services"
                :key="service.id"
              >
                <td v-if="headers[0].breakpoint()">{{ i + 1 }}</td>
                 <td>
                  <v-text-field
                    v-if="service.rename"
                    v-model="service.name"
                    dense
                    hide-details
                    clearable
                    append-outer-icon="mdi-check"
                    @click:clear="editing = false"
                    @click:append-outer="updateTodo(service, fields.NAME)"
                  ></v-text-field>
                  <span v-else>
                    {{ service.name }}
                    <span class="show-on-hover" v-if="isAdmin()">
                      <v-icon @click="service.rename = true" color="gray" small>
                        mdi-lead-pencil
                      </v-icon>
                    </span>
                  </span>
                </td>
                <td>
                  <span v-if="!isAdmin()">{{ service.addedAt | date }}</span>
                  <v-menu
                    v-else
                    v-model="service.addedAtPicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn small text color="orange darken-4" v-on="on">
                        {{ service.addedAt | date }}
                      </v-btn>
                    </template>
                    <v-date-picker
                      color="orange darken-4"
                      first-day-of-week="1"
                      :max="today"
                      v-model="service.addedAt"
                      @input="updateTodo(service, fields.ADDED_DATE)"
                      locale="ru-RU"
                    />
                  </v-menu>
                </td>
                <td>
                  <span v-if="!isAdmin()">{{ service.completedAt | date }}</span>
                  <v-menu
                    v-else
                    v-model="service.completedAtPicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-if="!service.completed"
                        small text color="green accent-4"
                        v-on="on"
                      >
                        Выбрать дату
                      </v-btn>
                      <v-btn small text color="green accent-4" v-on="on" v-else>
                        {{ service.completedAt | date }}
                      </v-btn>
                    </template>
                    <v-date-picker
                      color="green accent-4"
                      first-day-of-week="1"
                      :max="today"
                      v-model="service.completedAt"
                      @input="updateTodo(service, fields.COMPLETED_DATE)"
                      locale="ru-RU"
                    />
                  </v-menu>
                  <v-icon v-if="isAdmin() && service.showRemove" @click="removeTask(service)" small
                    class="onHover"
                    color="error">
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </tbody>
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
      @click="showNewTaskModal()"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import moment from 'moment';
import api from '../../api';
import { format as formatDate } from '../../helpers/dates';

const {
  loadMachineInfo,
  updateMachine,
  loadMachineServices,
  createMachineService,
  updateMachineService,
  deleteMachineService,
  isAdmin,
} = api;

const DATE_FORMAT = 'YYYY-MM-DD';

const mapService = item => ({
  ...item,
  clicked: false,
  rename: false,
  addedAt: formatDate(item.addedAt, DATE_FORMAT),
  completedAt: formatDate(item.completedAt, DATE_FORMAT),
  addedAtPicker: false,
  completedAtPicker: false,
  showRemove: false,
});

export default {
  components: {
    DatePicker: () => import('../helpers/DatePicker.vue'),
    DeleteModal: () => import('../helpers/DeleteModal.vue'),
  },

  props: {
    id: {
      type: [Number, String],
      required: true,
      default: 0,
    },
  },

  async beforeMount() {
    const { data } = await loadMachineInfo(this.id);

    this.item = data;
    this.loading = false;
    this.loadData();
  },

  data: vm => ({
    headers: [
      {
        text: '№',
        width: '5%',
        breakpoint: () => vm.$vuetify.breakpoint.smAndUp,
      },
      {
        text: 'Название',
        width: '55%',
        breakpoint: () => true,
      },
      {
        text: 'Дата добавления',
        width: '20%',
        breakpoint: () => true,
      },
      {
        text: 'Дата выполнения',
        width: '20%',
        breakpoint: () => true,
      },
    ],
    today: formatDate(new Date(), 'YYYY-MM-DD'),
    fields: {
      NAME: 'name',
      ADDED_DATE: 'addedAt',
      COMPLETED_DATE: 'completedAt',
    },
    selectedMonthId: moment().month(),
    currentMonthId: moment().month(),
    picker: '',

    item: {},
    editing: false,

    months: moment.months(),

    task: {
      name: '',
      isTO: false,
      addedAt: null,
      machineId: vm.id,
    },
    newTaskModal: false,

    deleteTask: {
      dialog: false,
      title: 'Удаление задачи',
      description: '',
      task: null,
    },

    loading: true,
  }),

  watch: {
    async id() {
      this.loadMachineData();
    },

    selectedMonthId() {
      this.loadData();
    },
  },

  methods: {
    isAdmin,

    async loadData() {
      this.loading = true;

      const query = {
        dateFrom: moment().month(this.selectedMonthId).startOf('month'),
        dateTo: moment().month(this.selectedMonthId).endOf('month'),
        onlyTO: false,
      };

      const response = await loadMachineServices(this.id, query);
      const activeServicesCount = response.data.filter(item => !item.completedAt).length;
      const services = response.data.map(mapService);

      this.item.activeServicesCount = activeServicesCount;
      this.$set(this.item, 'services', services);
      this.loading = false;
    },

    async loadMachineData() {
      this.loading = true;

      const { data } = await loadMachineInfo(this.id);

      this.item = data;
      this.loading = false;
      this.loadData();
    },

    getColorForService(service) {
      return service.datePicker ? 'primary' : 'yellow lighten-2';
    },

    showNewTaskModal() {
      this.newTaskModal = true;
    },

    closeNewTaskModal() {
      this.task = {};
      this.newTaskModal = false;
    },

    async createNewTask() {
      this.task.addedAt = moment(this.task.addedAt).utc();

      await createMachineService(this.id, this.task);

      this.newTaskModal = false;
      this.task = {};
      this.loadMachineData();
    },

    async updateTodo(todo, fieldName) {
      const fieldData = todo[fieldName];

      if (!fieldData) {
        return;
      }

      todo.datePicker = false;

      await updateMachineService(this.id, todo.id, { [fieldName]: fieldData });

      this.task = {};
      this.loadMachineData();
    },

    async updateMachine() {
      await updateMachine(this.id, this.item);

      this.editing = false;
      this.loadMachineData(this.id);
    },

    showRemoveModal(item) {
      item.showRemove = !item.showRemove;
    },

    async removeTask(task, success) {
      if (this.deleteTask.task) {
        if (success) {
          await deleteMachineService(this.id, task.id);
          this.loadMachineData();
        }
        this.deleteTask.task = null;
        this.deleteTask.dialog = false;
      } else {
        this.deleteTask.description = `Вы действительно хотите удалить ${task.name} ?`;
        this.deleteTask.task = task;
        this.deleteTask.dialog = true;
      }
    },
  },
};
</script>

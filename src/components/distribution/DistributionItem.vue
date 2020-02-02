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
                @update="date => task.addedDate = date"
              />
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
        <v-toolbar>
          <span class="headline">{{ item.name }}</span>
        </v-toolbar>
      </v-flex>
      <v-flex xs12>
        <v-sheet elevation="10" class="px-2">
          <v-slide-group v-model="selectedMonthId">
            <v-slide-item
              v-for="month in todosByMonths"
              :key="month.name"
              v-slot:default="{ active, toggle }"
            >
              <v-card
                :color="active ? 'yellow' : ''"
                width="85"
                height="50"
                @click="toggle"
                class="text-center"
              >
                <span class="body-2 font-weight-black">{{ month.name }}</span>
                <v-divider></v-divider>
                <span class="body-2 font-weight-medium">
                  <v-icon color="orange" xSmall>mdi-clock-outline</v-icon>
                  {{ month.todos | active }}
                </span> /
                <span class="body-2 font-weight-medium">
                  <v-icon color="success" xSmall>mdi-check</v-icon>
                  {{ month.todos | completed }}
                </span>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </v-sheet>
      </v-flex>
      <v-flex xs12 >
        <v-data-table
          :headers="headers"
          :items="monthTodos"
          hide-default-footer
          dense
          class="elevation-1"
          item-key="id"
          :items-per-page="100"
          :loading="loading"
          @click:row="showRemoveModal"
        >
          <template v-slot:item.name="{ item }" v-if="isAdmin()">
            <span v-show="!item.rename" @click="item.rename = true" class="pointer">
              {{ item.name }}
            </span>
            <v-text-field
              v-show="item.rename"
              v-model="item.name"
              dense
              hide-details
              append-icon="mdi-close"
              append-outer-icon="mdi-check"
              @click:append="item.rename = false"
              @click:append-outer="updateTodo(item, fields.NAME)"
            />
          </template>
          <template v-slot:item.addedDate="{ item }" v-if="isAdmin()">
            <v-menu
              v-model="item.addedDatePicker"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-btn small text color="orange darken-4" v-on="on">
                  {{ item.addedDate | date }}
                </v-btn>
              </template>
              <v-date-picker
                v-model="item.addedDate"
                @input="updateTodo(item, fields.ADDED_DATE)"
                locale="ru-RU"
              />
            </v-menu>
          </template>
          <template v-slot:item.completedDate="{ item }" v-if="isAdmin()">
            <v-menu
              v-model="item.completedDatePicker"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="!item.completed"
                  small text color="green accent-4"
                  v-on="on"
                >
                  Выбрать дату
                </v-btn>
                <v-btn small text color="green accent-4" v-on="on" v-else>
                  {{ item.completedDate | date }}
                </v-btn>
              </template>
              <v-date-picker
                v-model="item.completedDate"
                @input="updateTodo(item, fields.COMPLETED_DATE)"
                locale="ru-RU"
              />
            </v-menu>
            <v-icon v-if="isAdmin() && item.showRemove" @click="removeTask(item)" small
              class="onHover"
              color="error">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
        <v-fab-transition>
          <v-btn
            v-if="isAdmin()"
            color="green"
            dark
            bottom
            absolute
            right
            small
            @click="showNewTaskModal()"
          >
            Новая задача
          </v-btn>
        </v-fab-transition>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment';
import api from '../../api';
import { format as formatDate } from '../../helpers/dates';

const {
  loadPlaceServices,
  createPlaceService,
  updatePlaceService,
  removePlaceService,
  isAdmin,
} = api;

const DATE_FORMAT = 'YYYY-MM-DD';

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

  filters: {
    completed(value) {
      return value.filter(item => item.completed).length;
    },
    active(value) {
      return value.filter(item => !item.completed).length;
    },
  },

  async beforeMount() {
    await this.loadData();
  },

  data: () => ({
    headers: [
      {
        text: '№',
        value: 'index',
        width: 15,
        class: 'body-2 font-weight-black black--text',
      },
      {
        text: 'Название',
        value: 'name',
        sortable: false,
        width: 100,
        class: 'body-2 font-weight-black black--text',
      },
      {
        text: 'Дата добавления',
        value: 'addedDate',
        width: 50,
        class: 'body-2 font-weight-black black--text',
      },
      {
        text: 'Дата выполнения',
        value: 'completedDate',
        width: 50,
        class: 'body-2 font-weight-black black--text',
      },
    ],
    fields: {
      NAME: 'name',
      ADDED_DATE: 'addedDate',
      COMPLETED_DATE: 'completedDate',
    },
    selectedMonthId: moment().month(),
    picker: '',
    item: {},
    grouppedTodos: {},
    months: moment.months(),

    task: {},
    newTaskModal: false,

    deleteTask: {
      dialog: false,
      title: 'Удаление задачи',
      description: '',
      task: null,
    },

    loading: true,
  }),

  computed: {
    monthTodos() {
      return this.grouppedTodos[this.selectedMonthId];
    },

    todosByMonths() {
      return this.months.map((m, ind) => {
        let todos = [];

        if (this.grouppedTodos[ind]) {
          todos = this.grouppedTodos[ind];
        }

        return { todos, name: m };
      });
    },
  },

  methods: {
    isAdmin,
    groupTodosByMonths() {
      if (!this.item.todos) {
        this.grouppedTodos = {};

        return;
      }

      this.grouppedTodos = this.item.todos
        .reduce((acc, item, index) => {
          let month;

          if (item.completed) {
            month = moment(item.completedDate).month();
          } else {
            month = moment().month();
          }

          acc[month] = acc[month] || [];
          acc[month].push({ ...item, index });

          return acc;
        }, {});
    },

    async loadData() {
      this.loading = true;
      this.item = await loadPlaceServices(this.id);
      this.item.todos = this.item.todos
        .map(item => ({
          ...item,
          clicked: false,
          rename: false,
          addedDate: formatDate(item.addedDate, DATE_FORMAT),
          completedDate: formatDate(item.completedDate, DATE_FORMAT),
          addedDatePicker: false,
          completedDatePicker: false,
          showRemove: false,
        }));
      console.log(this.$vuetify.lang.current);

      this.groupTodosByMonths();
      this.loading = false;
    },

    getColorForTodo(todo) {
      return todo.datePicker ? 'primary' : 'yellow lighten-2';
    },

    showNewTaskModal() {
      this.newTaskModal = true;
    },

    closeNewTaskModal() {
      this.task = {};
      this.newTaskModal = false;
    },

    async createNewTask() {
      await createPlaceService(this.id, this.task);

      this.newTaskModal = false;
      this.loadData();
    },

    async updateTodo(todo, fieldName) {
      const fieldData = todo[fieldName];

      if (!fieldData) {
        return;
      }

      todo.datePicker = false;

      await updatePlaceService(this.id, todo.id, { [fieldName]: fieldData });

      this.loadData();
    },

    showRemoveModal(item) {
      item.showRemove = !item.showRemove;
    },

    async removeTask(task, success) {
      if (this.deleteTask.task) {
        if (success) {
          await removePlaceService(this.id, task.id);
          this.loadData();
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

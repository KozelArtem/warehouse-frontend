<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex>
        <v-dialog
          v-model="createNewPlace"
          :overlay="false"
          max-width="500px"
          transition="dialog-transition"
        >
          <v-card>
            <v-card-title primary-title>
              Добавление нового места
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="name"/>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outlined color="green" @click="createPlaceService(name)">Сохранить</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-toolbar dense color="orange lighten-2">
          <v-toolbar-title>Журнал работ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon color="green" @click="createNewPlace = true">mdi-database-plus</v-icon>
          </v-btn>
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="places"
          single-expand
          :expanded.sync="expanded"
          dense
          item-key="name"
          show-expand
          class="elevation-1"
        >
          <template v-slot:item.count="{ item }">
            {{ item.todos.length || 0 }} / {{ item.completed.length || 0 }}
          </template>
          <template v-slot:item.TO="{ item }">
            {{ getLastTO(item) }} -- {{ getNextTO(item) }}
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <v-text-field
                class="mt-3"
                solo
                dense
                placeholder="Новая задача"
                v-model="item.newTodo"
                :rules="[required, minLength]"
                @keydown="onKeyDown"
              ></v-text-field>
                <v-simple-table
                  dense
                  color="gray lighten-2"
                  :height="item.todos.length > 5 ? '150' : undefined"
                  fixed-header
                >
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-center">№</th>
                        <th class="text-center">Имя</th>
                        <th class="text-center">Дата
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-icon small v-on="on">mdi-information</v-icon>
                            </template>
                            Нажмите для выбора даты выполнения
                          </v-tooltip>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(todo, ind) in item.todos" :key="`pAtodo${ind}`">
                        <td class="text-center">{{ ind + 1 }}</td>
                        <td class="text-center"
                          v-show="!todo.rename"
                          @click="todo.rename = true"
                        >{{ todo.name }}</td>
                        <td class="text-center" v-show="todo.rename">
                          <v-text-field dense hide-details v-model="todo.name"
                            append-icon="mdi-close"
                            append-outer-icon="mdi-check"
                            @click:append="todo.rename = false"
                            @click:append-outer="updateTodo(ind, todo)"
                          />
                        </td>
                        <td class="text-center">
                          <v-menu
                            v-model="todo.datePicker"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-chip small :color="todo.datePicker ? 'primary' : 'white'"
                                v-on="on">
                                {{ todo.createdAt }}
                              </v-chip>
                            </template>
                            <v-date-picker
                              v-model="todo.completedDate"
                              @input="onSelectDate(item, todo)"
                              locale="ru-RU"
                            />
                          </v-menu>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              <v-btn block text xSmall class="green lighten-3"
                @click="showHistory()">
                <v-icon color="white">
                  {{ item.showCompleted ? 'mdi-chevron-up' : 'mdi-chevron-down'}}
                </v-icon>
              </v-btn>
              <v-simple-table
                class="green lighten-3"
                v-if="item.showCompleted"
                dense
                fixed-header
                :height="item.completed.length > 5 ? '150' : undefined"
              >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-center">№</th>
                      <th class="text-center">Имя</th>
                      <th class="text-center">Дата добавления</th>
                      <th class="text-center">Дата выполнения</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(todo, ind) in item.completed" :key="`pCtodo${todo.id}`">
                      <td class="text-center">{{ ind + 1 }}</td>
                      <td class="text-center"
                        v-show="!todo.rename"
                        @click="todo.rename = true"
                      >{{ todo.name }}</td>
                      <td class="text-center" v-show="todo.rename">
                        <v-text-field dense hide-details v-model="todo.name"
                          append-icon="mdi-close"
                          append-outer-icon="mdi-check"
                          @click:append="todo.rename = false"
                          @click:append-outer="updateTodo(ind, todo)"
                        />
                      </td>
                      <td class="text-center">{{ todo.createdAt }}</td>
                      <td class="text-center">{{ todo.completedDate }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import vue from 'vue';
import moment from 'moment';

import api from '../../api';
import { format as formatDate } from '../../helpers/dates';
import rules from '../../helpers/validationRules';

const {
  loadDistributionPlaces,
  createPlaceService,
  updatePlaceService,
  isAdmin,
  createDistributionPlace,
} = api;

export default {
  data: () => ({
    ...rules,
    headers: [
      {
        text: 'Оборудование',
        value: 'name',
        sortable: false,
        class: 'subtitle-1 font-weight-bold',
      },
      {
        text: 'Задачи',
        value: 'count',
        sortable: false,
        class: 'subtitle-1 font-weight-bold',
      },
      {
        text: 'ТО',
        value: 'TO',
        sortable: false,
        align: 'center',
        class: 'subtitle-1 font-weight-bold',
      },
    ],
    expanded: [],
    places: [],
    detail: [],
    datePickerMenu: false,
    completedCount: 0,

    createNewPlace: false,
    name: '',
  }),

  async beforeMount() {
    await this.loadData();
  },

  methods: {
    isAdmin,
    formatDate,
    async loadData() {
      const data = await loadDistributionPlaces();
      this.places = data
        .map((place) => {
          const mapped = (place.todos || []).map(this.formatTodo);
          const todos = mapped.filter(todo => !todo.completed);
          const completed = mapped.filter(todo => todo.completed);

          return {
            ...place,
            todos,
            completed,
            showCompleted: false,
            newTodo: '',
          };
        })
        .sort((a, b) => b.todos.length - a.todos.length);
    },

    formatTodo(todo) {
      const createdAt = formatDate(todo.createdAt || Date.now(), 'YYYY-MM-DD');
      const completedDate = formatDate(todo.completedDate || Date.now(), 'YYYY-MM-DD');

      return {
        ...todo,
        createdAt,
        completedDate,
        rename: false,
        datePicker: false,
      };
    },

    textLines(text) {
      return text ? text.split('\n') : [];
    },

    async createTodo() {
      const activeItem = this.expanded[0] || {};
      const name = activeItem.newTodo;
      if (!name && name.length < 2) {
        return;
      }

      const todo = await createPlaceService(activeItem.id, { name });

      activeItem.todos.push(this.formatTodo(todo));
      activeItem.newTodo = '';

      this.expanded[0] = activeItem;
    },

    async updateTodo(ind, todo) {
      const { name } = todo;
      if (!name && name.length < 2) {
        return;
      }

      const activeItem = this.expanded[0];
      const updated = await updatePlaceService(activeItem.id, todo.id, { name });
      const formated = this.formatTodo(updated);

      vue.set(activeItem.completed, ind, formated);
    },

    async createPlaceService(name) {
      if (!name.trim()) {
        return;
      }

      await createDistributionPlace({ name });
      this.loadData();
      this.createNewPlace = false;
    },

    getLastTO(item) {
      const to = (item.completed || [])
        .filter(todo => todo.name === 'ТО')
        .sort((a, b) => moment(b).diff(a))[0];

      if (to) {
        return formatDate(to.completedDate, 'YYYY-MM-DD');
      }

      return '';
    },

    getNextTO(item) {
      const lastTO = this.getLastTO(item);

      if (lastTO) {
        return moment(lastTO).add(1, 'month').format('YYYY-MM-DD');
      }

      return '';
    },

    onKeyDown(key) {
      if (key.code === 'Enter') {
        key.preventDefault();

        this.createTodo();
      }
    },

    async onSelectDate(dist, todo) {
      const data = {
        completedDate: todo.completedDate,
        completed: true,
      };

      await updatePlaceService(dist.id, todo.id, data);
      this.expanded[0].completed.unshift(todo);
      this.expanded[0].todos = this.expanded[0].todos.filter(t => t.id !== todo.id);
    },

    showHistory() {
      this.expanded[0].showCompleted = !this.expanded[0].showCompleted;
    },
  },
};
</script>

<style lang="scss" scoped>
.green-bg {
  background: rgba(0,255,0,0.3) !important;
}
</style>

<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex>
        <div class="text-center">
          <v-sheet color="orange lighten-2"
            class="subtitle-1">Журнал работ</v-sheet>
        </div>
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
            {{ item.todos.length || '' }}
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
                        <td class="text-center">{{ todo.name }}</td>
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
                      <td class="text-center">{{ todo.name }}</td>
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
import api from '../../api';
import dates from '../../helpers/dates';
import rules from '../../helpers/validationRules';

const {
  loadDistributionPlaces,
  loadPlaceServices,
  createPlaceService,
  updatePlaceService,
} = api;

const { format: formatDate } = dates;

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
    ],
    expanded: [],
    places: [],
    detail: [],
    datePickerMenu: false,
  }),

  async beforeMount() {
    await this.loadData();
  },

  watch: {
    expanded() {
      if ((this.expanded[0] || {}).id) {
        this.loadPlaceServiceList();
      }
    },
  },

  methods: {
    formatDate,
    async loadData() {
      const data = await loadDistributionPlaces();
      this.places = data.map((place) => {
        const todos = (place.todos || []).map(this.formatTodo).filter(todo => !todo.completed);

        return {
          ...place,
          todos,
          showCompleted: false,
          newTodo: '',
        };
      });
    },

    async loadPlaceServiceList() {
      const activeDist = this.expanded[0];
      const data = await loadPlaceServices(activeDist.id);

      activeDist.todos = data.map(this.formatTodo);

      this.expanded[0] = activeDist;
    },

    async loadCompletedPlaceServiceList() {
      const activeDist = this.expanded[0];
      const data = await loadPlaceServices(activeDist.id, true);

      activeDist.completed = data.map(this.formatTodo);

      this.expanded[0] = activeDist;
    },

    formatTodo(todo) {
      const createdAt = formatDate(todo.createdAt || Date.now(), 'YYYY-MM-DD');
      const completedDate = formatDate(todo.completedDate || Date.now(), 'YYYY-MM-DD');

      return {
        ...todo,
        createdAt,
        completedDate,
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


      this.expanded[0].completed.push(todo);
      await this.loadPlaceServiceList();
    },

    async showHistory() {
      await this.loadCompletedPlaceServiceList();

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

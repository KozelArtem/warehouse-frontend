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

          <span style="width: 150px">
            <v-text-field
              v-model="search"
              placeholder="Поиск"
              hide-details
              dense
              append-icon="mdi-magnify"
            />
          </span>

          <v-spacer></v-spacer>
          <v-btn icon v-if="!isAdmin()">
            <v-icon color="green" @click="createNewPlace = true">mdi-database-plus</v-icon>
          </v-btn>
        </v-toolbar>
        <v-data-table
          dense
          item-key="name"
          class="elevation-1"
          hide-default-footer
          :headers="headers"
          :items="places"
          :items-per-page="100"
          :search="search"
          :loading="loading"
          @click:row="openInfo"
        >
          <template v-slot:item.count="{ item }">
            {{ item.todos.length || 0 }} / {{ item.completed.length || 0 }}
          </template>
          <template v-slot:item.TO="{ item }">
            {{ getLastTO(item) | date }} -- {{ getNextTO(item) | date }}
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment';

import api from '../../api';
import { format as formatDate } from '../../helpers/dates';

const {
  loadDistributionPlaces,
  isAdmin,
  createDistributionPlace,
} = api;

export default {
  data: () => ({
    headers: [
      {
        text: 'Оборудование',
        value: 'name',
        sortable: false,
        class: 'body-2 font-weight-black black--text',
      },
      {
        text: 'Задачи',
        value: 'count',
        sortable: false,
        class: 'body-2 font-weight-black black--text',
      },
      {
        text: 'ТО',
        value: 'TO',
        sortable: false,
        align: 'center',
        class: 'body-2 font-weight-black black--text',
      },
    ],
    places: [],

    search: '',
    name: '',

    loading: true,

    createNewPlace: false,
  }),

  beforeMount() {
    this.loadData();
  },

  methods: {
    isAdmin,
    formatDate,
    async loadData() {
      this.loading = true;
      const data = await loadDistributionPlaces();

      this.places = data
        .map((place) => {
          const todos = place.todos.filter(todo => !todo.completed);
          const completed = place.todos.filter(todo => todo.completed);

          return {
            ...place,
            todos,
            completed,
          };
        })
        .sort((a, b) => b.todos.length - a.todos.length);

      this.loading = false;
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

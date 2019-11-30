<template>
  <div>
    <v-toolbar class="elevation-0">
      <v-toolbar-title>Накладные</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon color="green">mdi-plus-circle</v-icon>
      </v-btn>
    </v-toolbar>
      <v-divider></v-divider>
    <v-simple-table dense class="elevation-10">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Номер</th>
            <th class="text-left">Дата</th>
            <th class="text-left">Количество</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="pointer"
            v-for="item in items"
            :key="item.id"
            @click="selectRow(item)"
          >
            <td>{{ item.number }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.count }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-dialog
      v-model="dialog"
      scrollable fullscreen
      persistent :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="purple white--text darken-3">
          <span class="headline">
            <!-- {{ (category || {}).name ? 'Добавление нового' : 'Редактирование' }} элемента -->
          </span>
          <v-spacer></v-spacer>
          <v-icon color="red" @click="$emit('close')">{{icons.close}}</v-icon>
        </v-card-title>
        <v-card-text>
          <WaybillOrderList />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import WaybillOrderList from './WaybillOrderList.vue';

export default {
  components: {
    WaybillOrderList,
  },

  data: () => ({
    dialog: false,
    headers: [
      { name: 'Номер', value: 'number' },
      { name: 'Дата', value: 'date' },
      { name: 'Количество', value: 'count' },
    ],
    items: [
      {
        id: 1, number: 123, date: Date.now(), count: 5,
      },
      {
        id: 2, number: 1234, date: Date.now(), count: 15,
      },
      {
        id: 3, number: 1235, date: Date.now(), count: 52,
      },
    ],
  }),

  methods: {
    selectRow(row) {
      console.log(row);
      this.dialog = true;
    },
  },
};
</script>

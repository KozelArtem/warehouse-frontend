<template>
  <div>
    <v-dialog
      v-model="newWaybillDialog"
      scrollable fullscreen
      persistent no-click-animation
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="purple white--text darken-3">
          <span class="headline">Добавление накладной</span>
          <v-spacer></v-spacer>
          <v-icon color="red" @click="newWaybillDialog = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <WaybillForm @submit="onWaybillFormSubmit"/>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-toolbar class="elevation-0">
      <v-toolbar-title>Накладные</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon color="green" @click="newWaybillDialog = true">mdi-plus-circle</v-icon>
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
            v-for="waybill in waybills"
            :key="waybill.id"
            @click="selectRow(waybill)"
          >
            <td>{{ waybill.number }}</td>
            <td>{{ waybill.date }}</td>
            <td>{{ waybill.purchaseCount }}</td>
            <td>
               <v-icon>mdi-pencil</v-icon>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-dialog
      v-model="dialog"
      scrollable fullscreen
      persistent no-click-animation
      transition="dialog-transition"
    >
      <v-card v-if="selectedWaybill">
        <v-card-title class="purple white--text darken-3">
          <span class="headline">
            {{ `${selectedWaybill.number} от ${selectedWaybill.date}` }}
          </span>
          <v-spacer></v-spacer>
          <v-icon color="red" @click="dialog = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <WaybillInfo :id="selectedWaybill.id" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import api from '../../api';

import dates from '../../helpers/dates';

const { getWaybillList } = api;

const { format: formatDate } = dates;

export default {
  components: {
    WaybillForm: () => import('./WaybillForm.vue'),
    WaybillInfo: () => import('./WaybillInfo.vue'),
  },

  data: () => ({
    dialog: false,
    newWaybillDialog: false,

    selectedWaybill: null,

    waybills: [],
  }),

  beforeMount() {
    this.loadWaybills();
  },

  methods: {
    async loadWaybills() {
      const data = await getWaybillList();
      this.waybills = data.map(value => ({ ...value, date: formatDate(value.date) }));
    },

    selectRow(waybill) {
      this.selectedWaybill = waybill;
      this.dialog = true;
    },

    onWaybillFormSubmit() {
      this.newWaybillDialog = false;
      this.loadWaybills();
    }
  },
};
</script>

<style lang="scss">
</style>

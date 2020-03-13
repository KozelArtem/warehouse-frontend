<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="purple white--text darken-3">
          <span class="headline"></span>
          <v-spacer></v-spacer>
          <v-icon color="red" @click="closeDialog()">{{icons.close}}</v-icon>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-container grid-list-sm>
              <v-layout column>
                <v-flex>
                  <AutocompleteWithAdd
                    label="Наименование"
                    :items="distributionPlaces"
                    :loading="placesLoading"
                    :slotButtonDisabled="creatingPlace"
                    :selectedItemId="itemDistribution.placeId"
                    @slotButtonClick="newItem"
                    @change="placeId => itemDistribution.placeId = placeId"
                  />
                </v-flex>
                <v-flex>
                  <AutocompleteWithAdd
                    label="Накладная"
                    :items="waybills"
                    :loading="waybillsLoading"
                    :slotButtonDisabled="true"
                    :selectedItemId="itemDistribution.waybillId"
                    @change="waybillId => itemDistribution.waybillId = waybillId"
                  />
                </v-flex>
                <v-flex>
                  <v-menu
                      v-model="datePickerMenu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="itemDistribution.date"
                        label="Дата"
                        :rules="[required]"
                        hide-details
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="itemDistribution.date"
                      @input="datePickerMenu = false"
                      :max="today"
                      locale="ru-RU"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex>
                  <v-text-field
                    v-model="itemDistribution.amount"
                    label="Количество"
                    type="number"
                    min="0"
                    :rules="[required, positiveNumber]"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="green"
            :dark="valid"
            :disabled="!valid"
            @click="saveItemDistribution()"
          >Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="mappedItems"
      class="elevation-1"
      item-key="id"
      :no-data-text="noData"
      :no-results-text="noResults"
      locale="ru-RU"
      disable-sort
      dense
      hide-default-footer
    >
      <template v-slot:footer="">
        <v-btn
          fab
          color="green"
          bottom
          xSmall
          right
          absolute
          dark
          @click="dialog = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.placeName="{ item }">
        {{ item.placeName }}
        <span class="show-on-hover">
          <v-icon @click="openEditDialog(item)" color="gray" small>mdi-lead-pencil</v-icon>
        </span>
      </template>
      <template v-slot:item.waybill="{ item }">
        <router-link v-if="item.waybill" :to="`waybill/${item.waybill.id}`">
          {{ item.waybill.number }}
        </router-link>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import api from '../../api';

import { format as formatDate, sortDesc } from '../../helpers/dates';
import validationRules from '../../helpers/validationRules';

import constant from '../../constants/data.json';

import AutocompleteWithAdd from '../helpers/AutocompleteWithAdd.vue';

const {
  isAdmin,
  loadDistributionPlaces,
  createDistributionPlace,
  createItemDistribution,
  updateItemDistribution,
  getItemDistributionInfo,
  getWaybillList,
} = api;

export default {
  components: {
    AutocompleteWithAdd,
  },

  props: {
    itemId: {
      type: [Number, String],
      required: true,
      default: 0,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  // TODO Show todos for this month
  data: () => ({
    headers: [
      {
        text: '№',
        value: 'index',
        divider: true,
      },
      {
        text: 'Куда',
        value: 'placeName',
        sortable: false,
        divider: true,
      },
      {
        text: 'Накладная',
        value: 'waybill',
        sortable: false,
        divider: true,
      },
      {
        text: 'Дата',
        value: 'date',
        divider: true,
        sort: sortDesc,
      },
      {
        text: 'Количество',
        value: 'amount',
        sortable: false,
        divider: true,
      },
    ],

    placesLoading: true,
    waybillsLoading: true,

    distributionPlaces: [],
    waybills: [],
    search: null,

    dialog: false,

    creatingPlace: false,

    datePickerMenu: false,

    itemDistribution: {},
    itemDistributionTemplate: {
      placeId: 0,
      waybillId: 0,
      date: formatDate(Date.now(), 'YYYY-MM-DD'),
      amount: 0,
    },

    today: formatDate(Date.now(), 'YYYY-MM-DD'),
    valid: false,

    ...constant,
    ...validationRules,
  }),

  computed: {
    mappedItems() {
      return this.items.map((item, index) => ({
        ...item,
        index: index + 1,
        date: formatDate(item.date),
        placeName: item.place.name,
      }));
    },
  },

  beforeMount() {
    this.itemDistribution = { ...this.itemDistributionTemplate };
    this.loadPlaces();
    this.loadWaybills();
  },

  methods: {
    isAdmin() {
      return isAdmin();
    },

    openEditDialog(item) {
      this.itemDistribution = {
        id: item.id,
        amount: item.amount,
        date: formatDate(item.date, 'YYYY-MM-DD'),
        placeId: item.place.id,
        waybillId: item.waybillId,
        edit: true,
      };
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
      this.itemDistribution = { ...this.itemDistributionTemplate };
    },

    async loadWaybills() {
      const data = await getWaybillList(this.itemId);

      this.waybills = data.map(item => ({
        id: item.id,
        name: `${item.number} - ${formatDate(item.date)}`,
      }));
      this.waybillsLoading = false;
    },

    async loadPlaces() {
      const response = await loadDistributionPlaces();

      this.distributionPlaces = response.data;
      this.placesLoading = false;
    },

    async newItem(input) {
      if (!input) {
        return;
      }

      this.creatingPlace = true;

      const place = await createDistributionPlace({ name: input });

      this.creatingPlace = false;

      if (place) {
        this.distributionPlaces.push(place);
        this.itemDistribution.placeId = place.id;
      }
    },

    async saveItemDistribution() {
      let responseData;

      if (this.itemDistribution.edit) {
        const { id } = this.itemDistribution;

        responseData = await updateItemDistribution(this.itemId, id, this.itemDistribution);
      } else {
        responseData = await createItemDistribution(this.itemId, this.itemDistribution);
      }

      if (responseData.id) {
        const result = await getItemDistributionInfo(this.itemId, responseData.id);

        this.itemDistribution = { ...this.itemDistributionTemplate };
        this.dialog = false;
        this.$emit('submit', result);
      }
    },
  },
};
</script>

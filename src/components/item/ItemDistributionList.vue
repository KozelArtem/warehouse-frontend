<template>
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
  >
    <template v-slot:body.prepend="{ item, headers }" v-if="isAdmin()">
      <tr>
        <td :colspan="headers.length">
          <v-form v-model="valid">
            <v-layout row wrap class="py-3">
              <v-flex xs5>
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
              <v-flex xs4>
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
                      dense
                      hide-details
                      :rules="[required]"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="itemDistribution.date"
                    @input="datePickerMenu = false"
                    locale="ru-RU"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs2>
                <v-text-field
                  v-model="itemDistribution.amount"
                  label="Количество"
                  dense
                  hide-details
                  type="number"
                  min="0"
                  :rules="[required, positiveNumber]"
                ></v-text-field>
              </v-flex>
              <v-flex xs1 text-center>
                <v-icon color="green" :disabled="!valid" @click="saveItemDistribution()">
                  mdi-content-save
                </v-icon>
              </v-flex>
            </v-layout>
          </v-form>
        </td>
      </tr>
    </template>
  </v-data-table>
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
  getItemDistributionInfo,
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
    distributionPlaces: [],
    search: null,

    creatingPlace: false,

    datePickerMenu: false,

    itemDistribution: {},
    itemDistributionTemplate: {
      placeId: 0,
      date: formatDate(Date.now(), 'YYYY-MM-DD'),
      amount: 0,
    },

    valid: false,

    ...constant,
    ...validationRules,
  }),

  computed: {
    mappedItems() {
      return this.items.map((item, index) => ({
        ...item,
        index: index + 1,
        date: formatDate(item.date, 'DD.MM.YYYY'),
        placeName: item.place.name,
      }));
    },
  },

  beforeMount() {
    this.itemDistribution = { ...this.itemDistributionTemplate };
    this.loadPlaces();
  },

  methods: {
    isAdmin() {
      return isAdmin();
    },

    async loadPlaces() {
      this.distributionPlaces = await loadDistributionPlaces();

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
      const createdData = await createItemDistribution(this.itemId, this.itemDistribution);

      if (createdData.id) {
        const result = await getItemDistributionInfo(this.itemId, createdData.id);

        this.itemDistribution = { ...this.itemDistributionTemplate };
        this.$emit('submit', result);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

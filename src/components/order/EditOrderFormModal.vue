<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <QuickCreateItemModal
      :dialog="newItemDialog"
      @close="newItemDialog = false"
      @submit="onNewItem"
    />
    <v-card>
      <v-card-title class="purple darken-3 white--text">
        <span class="headline">Заказы</span>
        <v-spacer></v-spacer>
        <v-icon color="red" @click="$emit('close')">{{icons.close}}</v-icon>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-container grid-list-md>
            <v-layout column wrap>
              <v-flex>
                <AutocompleteWithAdd
                  label="Наименование"
                  :items="itemsNames"
                  :loading="loadingItems"
                  :slotButtonDisabled="newItemDialog"
                  :selectedItemId="localOrder.itemId"
                  @slotButtonClick="newItemDialog = true; activeOrderInd = i"
                  @change="itemId => localOrder.itemId = itemId"
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  label="Количество"
                  v-model="localOrder.orderAmount"
                  hide-details
                  dense
                  type="number"
                  :rules="[required, positiveNumber]"
                />
              </v-flex>
              <v-flex>
                <v-menu
                v-model="datePickerMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="localOrder.date"
                      label="Дата"
                      hide-details
                      dense
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="localOrder.date"
                    @input="datePickerMenu = false"
                    locale="ru-RU"
                  />
                </v-menu>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          small
          color="success"
          :dark="valid"
          :loading="formLoading"
          :disabled="!valid"
          @click="onSave()"
        >Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '../../api';
import constants from '../../constants/data.json';

import { format as formatDate } from '../../helpers/dates';
import rules from '../../helpers/validationRules';

import AutocompleteWithAdd from '../helpers/AutocompleteWithAdd.vue';
import QuickCreateItemModal from '../item/QuickCreateItemModal.vue';

const {
  updateOrder,
  getItemList,
} = api;

const {
  icons,
} = constants;

export default {
  components: {
    AutocompleteWithAdd,
    QuickCreateItemModal,
  },

  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    order: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  data: () => ({
    icons,
    ...rules,

    itemsLoading: false,
    newItemDialog: false,
    activeOrderInd: -1,

    loadingItems: false,
    items: [],

    orderTemplate: {
      itemId: 0,
      date: formatDate(Date.now(), 'YYYY-MM-DD'),
      amount: 0,
    },

    localOrder: {},
    search: null,
    datePickerMenu: false,
    valid: false,

    loading: false,
    formLoading: false,
  }),

  computed: {
    itemsNames() {
      return this.items.map(value => ({
        // TODO show category on hover
        id: value.id,
        name: `${value.categoryName} - ${value.name}`,
      }));
    },
  },

  async beforeMount() {
    this.localOrder = { ...this.orderTemplate };
    this.itemsLoading = true;

    this.items = await getItemList();
    this.itemsLoading = false;
  },

  watch: {
    order() {
      const item = this.order.item || {};
      this.localOrder = {
        ...this.order,
        date: formatDate(this.order.date, 'YYYY-MM-DD'),
        itemId: item.id,
      };
    },
  },

  methods: {
    formatDate,

    onNewItem(item) {
      this.items.push(item);
      this.orders[this.activeOrderInd].itemId = item.id;
      this.activeOrderInd = -1;
      this.newItemDialog = false;
    },

    async onSave() {
      this.formLoading = true;

      const result = await updateOrder(this.localOrder.id, this.localOrder);

      this.formLoading = false;

      if (!result.id) {
        return;
      }

      const item = this.items.filter(value => this.localOrder.itemId === value.id)[0];

      this.localOrder.item = item;
      this.$emit('submit', this.localOrder);
      this.localOrder = { ...this.orderTemplate };
    },
  },
};
</script>

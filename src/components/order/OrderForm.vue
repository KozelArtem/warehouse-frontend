<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <QuickCreateItemModal
      :dialog="newItemDialog"
      :name="inputName"
      @close="newItemDialog = false"
      @submit="onNewItem"
    />
    <CompanyModal
      :dialog="showCompanyDialog"
      @close="showCompanyDialog = false"
      @submit="onNewCompany"
    />
    <v-card>
      <v-card-title class="purple darken-3 white--text">
        <span class="headline">Заказы</span>
        <v-spacer></v-spacer>
        <v-icon color="red" @click="onClose()">{{icons.close}}</v-icon>
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
                  :selectedItemId="order.itemId"
                  @slotButtonClick="onAddNewItemClick"
                  @change="onItemSelect"
                />
              </v-flex>
              <v-flex>
                <AutocompleteWithAdd
                  label="Компания"
                  :items="companies"
                  :loading="loadingCompanies"
                  :slotButtonDisabled="showCompanyDialog"
                  :selectedItemId="order.companyId"
                  :requiredField="false"
                  @slotButtonClick="showCompanyDialog = true"
                  @change="companyId => order.companyId = companyId"
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  label="Количество"
                  v-model="order.orderAmount"
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
                      v-model="order.date"
                      label="Дата"
                      hide-details
                      dense
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="order.date"
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
import CompanyModal from '../company/CompanyModal.vue';

const {
  updateItem,
  createOrder,
  getItemList,
  getItemShortInfo,
  getShortCompanyList,
} = api;

const {
  icons,
} = constants;

export default {
  components: {
    AutocompleteWithAdd,
    QuickCreateItemModal,
    CompanyModal,
  },

  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data: () => ({
    icons,
    ...rules,

    itemsLoading: false,
    newItemDialog: false,
    showCompanyDialog: false,
    inputName: null,

    loadingItems: false,
    items: [],

    loadingCompanies: false,
    companies: [],

    orderTemplate: {
      itemId: 0,
      companyId: 0,
      date: formatDate(Date.now(), 'YYYY-MM-DD'),
      amount: 0,
    },

    order: {},
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
    this.order = { ...this.orderTemplate };

    this.loadItemList();
    this.loadCompanyList();
  },

  methods: {
    formatDate,

    async loadItemList() {
      this.itemsLoading = true;
      this.items = await getItemList();
      this.itemsLoading = false;
    },

    async loadCompanyList() {
      this.loadingCompanies = true;
      this.companies = await getShortCompanyList();
      this.loadingCompanies = false;
    },

    async onNewItem(newItem) {
      const item = await getItemShortInfo(newItem.id);
      this.items.push(item);
      this.order.itemId = item.id;
      this.order.companyId = item.companyId || 0;
      this.newItemDialog = false;
    },

    async onNewCompany(company) {
      this.companies.push(company);
      await updateItem(this.order.itemId, { companyId: company.id });

      this.order.companyId = company.id;
      this.showCompanyDialog = false;
    },

    onItemSelect(itemId) {
      const item = this.items.filter(value => value.id === itemId)[0] || {};

      this.order.itemId = itemId;
      this.order.companyId = item.companyId || 0;
    },

    async onSave() {
      this.formLoading = true;

      const item = this.items.filter(value => value.id === this.order.itemId)[0] || {};
      const newCompanyId = this.order.companyId;

      if (newCompanyId !== item.companyId) {
        await updateItem(this.order.itemId, { companyId: newCompanyId });
      }

      delete this.order.companyId;

      await createOrder(this.order);

      this.order = { ...this.orderTemplate };
      this.formLoading = false;

      this.$emit('submit');
    },

    onClose() {
      this.order = { ...this.orderTemplate };

      this.$emit('close');
    },

    onAddNewItemClick(input) {
      this.newItemDialog = true;
      this.inputName = input;
    },
  },
};
</script>

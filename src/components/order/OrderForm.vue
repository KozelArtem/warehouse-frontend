<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <QuickCreateItemModal
      v-show="newItemDialog"
      :dialog="newItemDialog"
      :name="inputName"
      @close="newItemDialog = false"
      @submit="onNewItem"
    />
    <CompanyModal
      v-show="showCompanyDialog"
      :dialog="showCompanyDialog"
      @close="showCompanyDialog = false"
      @submit="onNewCompany"
    />
    <v-card>
      <v-card-title class="green lighten-3">
        <span class="headline">{{ title }}</span>
        <v-spacer></v-spacer>
        <v-icon color="red" @click="onClose()">mdi-close</v-icon>
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
                  required
                  min="0"
                />
              </v-flex>
              <v-flex>
                <DatePicker v-model="order.date" />
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
          :loading="loading"
          :disabled="!valid"
          @click="onSave()"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { ITEM_NAMESPACE, COMPANY_NAMESPACE } from '../../store/namespaces';

import { format as formatDate } from '../../helpers/dates';
import rules from '../../helpers/validationRules';

import AutocompleteWithAdd from '../helpers/AutocompleteWithAdd.vue';
import DatePicker from '../helpers/DatePicker.vue';

export default {
  components: {
    AutocompleteWithAdd,
    DatePicker,
    QuickCreateItemModal: () => import('../item/QuickCreateItemModal.vue'),
    CompanyModal: () => import('../company/CompanyModal.vue'),
  },

  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    title: {
      type: String,
      required: false,
      default: 'Добавление нового заказа',
    },
    inputOrder: {
      type: Object,
      required: false,
      default: () => {},
    },
  },

  data: () => ({
    ...rules,

    newItemDialog: false,
    showCompanyDialog: false,
    inputName: null,

    orderTemplate: {
      itemId: 0,
      companyId: 0,
      date: Date.now(),
      amount: 0,
    },

    order: {},
    valid: false,

    loading: false,
  }),

  computed: {
    ...mapGetters(ITEM_NAMESPACE, { loadingItems: 'isLoading', items: 'itemList' }),
    ...mapGetters(COMPANY_NAMESPACE, { loadingCompanies: 'isLoading', companies: 'companyList' }),

    itemsNames() {
      return this.items.map(value => ({
        id: value.id,
        name: `${value.categoryName} - ${value.name}`,
      }));
    },
  },

  async beforeMount() {
    this.order = { ...this.orderTemplate };

    this.fetchItems();
    this.fetchCompanies();
  },

  watch: {
    inputOrder() {
      if (!this.inputOrder) {
        return;
      }

      const {
        item: {
          id: itemId,
          companyId,
        },
      } = this.inputOrder;

      this.order = {
        itemId,
        companyId,
        ...this.inputOrder,
      };
    },
  },

  methods: {
    formatDate,
    ...mapActions(ITEM_NAMESPACE, ['fetchItems', 'updateItem']),
    ...mapActions(COMPANY_NAMESPACE, ['fetchCompanies']),

    onNewItem(newItem) {
      this.getItemById(newItem.id);
      this.order.itemId = newItem.id;
      this.order.companyId = newItem.companyId || 0;
      this.newItemDialog = false;
    },

    async onNewCompany(company) {
      this.companies.push(company);
      this.updateItem(this.order.itemId, { companyId: company.id });

      this.order.companyId = company.id;
      this.showCompanyDialog = false;
    },

    onItemSelect(itemId) {
      const item = this.items.find(value => value.id === itemId) || {};

      this.order.itemId = itemId;
      this.order.companyId = item.companyId || 0;
    },

    async onSave() {
      this.loading = true;

      const item = this.items.find(value => value.id === this.order.itemId) || {};
      const newCompanyId = this.order.companyId;

      if (newCompanyId !== item.companyId) {
        this.updateItem(this.order.itemId, { companyId: newCompanyId });
      }

      delete this.order.companyId;

      this.emit('submit', this.order);

      this.order = { ...this.orderTemplate };
      this.loading = false;

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

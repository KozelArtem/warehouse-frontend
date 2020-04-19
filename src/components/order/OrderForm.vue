<template>
  <v-dialog :value="true" persistent max-width="600px">
    <QuickCreateItemModal
      v-if="newItemDialog"
      :name="inputName"
      @close="newItemDialog = false"
      @submit="onNewItem"
    />
    <CompanyForm
      v-if="showCompanyDialog"
      @close="showCompanyDialog = false"
      @submit="onNewCompany"
    />
    <DeleteModal
      v-if="deleteModal.dialog"
      :title="deleteModal.title"
      :description="deleteModal.description"
      @click="deleteModalResult"
    />
    <v-card>
      <v-card-title class="green lighten-3">
        <span class="headline">{{ title }}</span>
        <v-spacer></v-spacer>
        <v-icon color="red" @click="onClose()">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-container grid-list-md fluid>
            <v-layout column wrap>
              <v-flex>
                <AutocompleteWithAdd
                  v-model="purchase.itemId"
                  label="Наименование"
                  :items="itemsNames"
                  :loading="loadingItems"
                  :slotButtonDisabled="newItemDialog"
                  @slotButtonClick="onAddNewItemClick"
                />
              </v-flex>
              <v-flex>
                <AutocompleteWithAdd
                  v-model="purchase.companyId"
                  label="Компания"
                  :items="companies"
                  :loading="loadingCompanies"
                  :slotButtonDisabled="showCompanyDialog"
                  :requiredField="false"
                  @slotButtonClick="showCompanyDialog = true"
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  label="Количество"
                  v-model="purchase.orderAmount"
                  hide-details
                  dense
                  type="number"
                  required
                  min="0"
                />
              </v-flex>
              <v-flex>
                <DatePicker v-model="purchase.date" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-if="input"
          color="red lighten-1"
          class="ml-6"
          dark small
          @click="showDeleteModal"
        >
          Удалить
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-6"
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
import { ITEM_NAMESPACE, COMPANY_NAMESPACE, PURCHASE_NAMESPACE } from '../../store/namespaces';

import rules from '../../helpers/validationRules';

import AutocompleteWithAdd from '../helpers/AutocompleteWithAdd.vue';
import DatePicker from '../helpers/DatePicker.vue';

export default {
  components: {
    AutocompleteWithAdd,
    DatePicker,
    DeleteModal: () => import('../helpers/DeleteModal.vue'),
    QuickCreateItemModal: () => import('../item/QuickCreateItemModal.vue'),
    CompanyForm: () => import('../company/CompanyForm.vue'),
  },

  props: {
    title: {
      type: String,
      required: false,
      default: 'Добавление нового заказа',
    },
    input: {
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

    purchaseTemplate: {
      itemId: 0,
      companyId: 0,
      date: Date.now(),
      amount: 0,
    },
    deleteModal: {
      dialog: false,
    },

    purchase: {},
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

  beforeMount() {
    if ((this.input || {}).item) {
      const { id: itemId } = this.input.item || {};
      this.purchase = {
        ...this.purchaseTemplate,
        ...this.input,
        itemId,
      };
    } else {
      this.purchase = { ...this.purchaseTemplate };
    }

    this.fetchItems();
    this.fetchCompanies();
  },

  watch: {
    input() {
      if (!(this.input || {}).item) {
        return;
      }

      const { id: itemId } = this.input.item;
      this.purchase = {
        ...this.purchaseTemplate,
        ...this.input,
        itemId,
      };
    },
  },

  methods: {
    ...mapActions(ITEM_NAMESPACE, ['fetchItems']),
    ...mapActions(COMPANY_NAMESPACE, ['fetchCompanies']),
    ...mapActions(PURCHASE_NAMESPACE, ['createPurchase', 'updatePurchase', 'removePurchase']),

    onNewItem(newItem) {
      this.purchase.itemId = newItem.id;
      this.newItemDialog = false;
    },

    async onNewCompany(company) {
      this.purchase.companyId = company.id;
      this.showCompanyDialog = false;
    },

    async onSave() {
      let result;

      if (this.input) {
        result = await this.updatePurchase(this.purchase);
      } else {
        result = await this.createPurchase(this.purchase);
      }

      this.$emit('submit', result);
    },

    onClose() {
      this.purchase = { ...this.purchaseTemplate };
      this.$emit('close');
    },

    onAddNewItemClick(input) {
      this.newItemDialog = true;
      this.inputName = input;
    },

    showDeleteModal() {
      const title = 'Удаление заказа';
      const description = `Вы действительно хотите удалить заказ "${this.purchase.item.name}"?`;

      this.deleteModal = {
        title,
        description,
        dialog: true,
      };
    },

    deleteModalResult(result) {
      if (result) {
        this.removePurchase(this.purchase.id);
      }

      this.deleteModal = { dialog: false };
      this.$emit('close');
    },
  },
};
</script>

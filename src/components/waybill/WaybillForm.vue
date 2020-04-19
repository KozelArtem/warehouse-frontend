<template>
  <v-form v-model="valid">

    <OrderForm
      v-if="newOrderDialog"
      :dialog="newOrderDialog"
      @close="newOrderDialog = false"
      @submit="addOrder"
    />

    <CompanyForm
      :dialog="showCompanyDialog"
      @close="showCompanyDialog = false"
      @submit="onNewCompany"
    />

    <v-container grid-list-xs>
      <v-layout row wrap>
        <v-flex xs4>
          <v-text-field
            label="Номер"
            hide-details
            dense
            v-model="waybill.number"
            :rules="[required, minLength]"
          />
        </v-flex>
        <v-flex xs4>
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
                v-model="waybill.date"
                label="Дата"
                hide-details
                dense
                readonly
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="waybill.date"
              @input="datePickerMenu = false"
              locale="ru-RU"
            />
          </v-menu>
        </v-flex>
        <v-flex xs4>
          <AutocompleteWithAdd
            v-model="waybill.companyId"
            label="Компания"
            :items="companies"
            :loading="loadingCompanies"
            :slotButtonDisabled="showCompanyDialog"
            :requiredField="false"
            :clearable="true"
            @slotButtonClick="showCompanyDialog = true"
          />
        </v-flex>
        <v-flex xs12 class="elevation-4 pt-3">
          <span class="d-flex">
            <span class="headline ml-3">Заказы</span>
            <v-spacer></v-spacer>
            <v-btn color="success" small text @click="newOrderDialog = true">Добавить</v-btn>
          </span>
          <v-divider></v-divider>
          <v-simple-table dense class="max-height-60" fixed-header>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Наименование</th>
                  <th class="text-left">Количество</th>
                  <th class="text-left">Дата</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  :class="[{ 'light-blue': order.selected }, 'pointer']"
                  v-for="order in orders"
                  :key="order.id"
                  @click="selectOrder(order)"
                >
                  <td>{{ order.item.name }}</td>
                  <td>{{ order.orderAmount }}</td>
                  <td>{{ order.date | date }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-flex>
        <v-flex xs4>
          <span>
            Выбрано: {{ selectedOrdersCount }}
          </span>
        </v-flex>
        <v-flex xs4>
          <v-btn
            color="success"
            :disabled="!valid"
            :loading="loading"
            @click="submit()"
          >
            Сохранить
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>

</template>

<script>
import api from '../../api';

import constants from '../../constants/data.json';

import { format as formatDate, sortDesc } from '../../helpers/dates';
import rules from '../../helpers/validationRules';

const {
  getOrders,
  createWaybill,
  getShortCompanyList,
} = api;

const {
  icons,
} = constants;

export default {
  components: {
    OrderForm: () => import('../order/OrderForm.vue'),
    CompanyForm: () => import('../company/CompanyForm.vue'),
    AutocompleteWithAdd: () => import('../helpers/AutocompleteWithAdd.vue'),
  },

  data: () => ({
    ...icons,
    ...rules,

    newOrderDialog: false,

    showCompanyDialog: false,
    loadingCompanies: false,
    companies: [],

    valid: false,
    loading: false,
    datePickerMenu: false,
    waybill: {},
    waybillTemplate: {
      number: '',
      date: formatDate(Date.now(), 'YYYY-MM-DD'),
      companyId: 0,
      orders: [],
    },

    query: {
      offset: 0,
      limit: 100,
      active: true,
    },

    orders: [],
  }),

  beforeMount() {
    this.waybill = { ...this.waybillTemplate };
    this.loadOrders();
    this.loadCompanyList();
  },

  computed: {
    selectedOrdersCount() {
      return this.orders.filter(order => order.selected).length;
    },
  },

  methods: {
    async addOrder() {
      this.newOrderDialog = false;

      this.loading = true;
      const { data } = await getOrders(this.query);

      const newOrders = data
        .filter(order => !this.orders.find(i => i.id === order.id))
        .map(order => ({ ...order, selected: true }));

      this.loading = false;

      this.orders.unshift(...newOrders);
    },

    async loadOrders() {
      const { data } = await getOrders(this.query);

      this.orders = data
        .map(order => ({
          ...order,
          selected: false,
        }))
        .sort((a, b) => sortDesc(a.date, b.date));
    },

    async selectOrder(order) {
      const copy = order;
      copy.selected = !copy.selected;
      this.orders = this.orders.sort((a, b) => {
        if (a.selected && !b.selected) {
          return -1;
        }

        return 1;
      });
    },

    async submit() {
      if (!this.valid) {
        return;
      }

      this.loading = true;
      this.waybill.orders = this.orders.filter(order => order.selected);

      const waybillFromAPI = await createWaybill(this.waybill);

      this.waybill = { ...this.waybillTemplate };
      this.loading = false;
      this.$emit('submit', waybillFromAPI);
    },

    async loadCompanyList() {
      this.loadingCompanies = true;
      this.companies = await getShortCompanyList();
      this.loadingCompanies = false;
    },

    async onNewCompany(company) {
      this.companies.push(company);
      this.waybill.companyId = company.id;
      this.showCompanyDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.light-blue {
  background-color: lightblue;
}
.max-height-60 {
  overflow-y: scroll;
  max-height: 60vh;
}
</style>

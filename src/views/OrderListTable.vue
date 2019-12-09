<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex xs12>
        <v-data-table
          dense
          :headers="headers"
          :items="sortedOrders"
          :loading="loading"
          :loading-text="constants.loading"
          :no-results-text="constants.noResults"
          :no-data-text="constants.noData"
          @click:row="selectRow"
        >
          <template v-slot:top>
            <v-toolbar color="">
              <v-toolbar-title v-if="$vuetify.breakpoint.smAndUp">{{ title }}</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <span style="width: 200px">
                <v-select
                  v-model="activeOrderSortId"
                  :items="statuses"
                  menu-props="auto"
                  label="Статус"
                  hide-details
                  item-value="id"
                  item-text="name"
                  prepend-icon="mdi-sort"
                  single-line
                ></v-select>
              </span>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog persistent v-if="isAdmin()" v-model="dialog" max-width="80%">
                <template v-slot:activator="{ on }">
                  <v-icon medium v-on="on" color="green" class="mr-1">
                    mdi-square-edit-outline</v-icon>
                </template>
                <OrderForm :dialog="dialog" @submit="onSubmit" @close="dialog = false" />
              </v-dialog>
            </v-toolbar>
          </template>

          <template v-slot:header.name="{ header }">
            {{ header.text }}
            <v-tooltip bottom v-if="isAdmin()">
              <template v-slot:activator="{ on }">
                <v-icon color="green" dark small v-on="on">mdi-information</v-icon>
              </template>
              <span>
                Клик - редактирование <br/>
                Правая - удаление
              </span>
            </v-tooltip>
          </template>

          <template v-slot:item.name="{ item }">
            <span @contextmenu.prevent="deleteOrder(item)">{{ item.item.name }}</span>
          </template>

          <template v-slot:item.amount="{ item }">
            <span>{{ item.orderAmount }} / {{ item.amount }}</span>
          </template>

          <template v-slot:item.status="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon
                  color="green"
                  small
                  v-on="on"
                  @click.stop="companyId = item.item.companyId; companyDialog = true"
                >
                  mdi-information
                </v-icon>
              </template>
              <span>Информация о компании</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon :color="item.status.color" small v-on="on">{{ item.status.icon }}</v-icon>
              </template>
              <span>Статус заказа: {{ item.status.name }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex xs12>
        <CompanyInfoModal
          :companyId="companyId || 0"
          :dialog="companyDialog"
          @close="companyDialog = false"
        />
        <EditOrderFormModal
          :order="editedOrder"
          :dialog="editOrderDialog"
          @submit="onEditSubmit"
          @close="editOrderDialog = false"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '../api';
import constants from '../constants/data.json';
import { format as formatDate, sortDesc } from '../helpers/dates';

import OrderForm from '../components/order/OrderForm.vue';
import EditOrderFormModal from '../components/order/EditOrderFormModal.vue';
import CompanyInfoModal from '../components/company/CompanyInfoModal.vue';

const {
  isAdmin,
  getOrders,
  getOrdersByIds,
  removeOrder,
} = api;

const orderStatuses = {
  all: {
    id: 0,
    name: 'Все',
  },
  active: {
    id: 1,
    name: 'В ожидании',
    icon: 'mdi-calendar-clock',
    color: 'orange',
  },
  completed: {
    id: 2,
    name: 'Завершенные',
    icon: 'mdi-check',
    color: 'green',
  },
};

export default {
  components: {
    OrderForm,
    EditOrderFormModal,
    CompanyInfoModal,
  },

  data: () => ({
    selectedRow: null,
    editRow: false,
    constants,
    activeOrderSortId: orderStatuses.active.id,

    headers: [
      { text: '№', value: 'index' },
      { text: 'Наименование', value: 'name', sortable: false },
      { text: 'Заказано / Пришло', value: 'amount', sortable: false },
      { text: 'Дата', value: 'date', sort: sortDesc },
      { text: 'Статус', value: 'status', sortable: false },
    ],

    title: 'Заказы',

    loading: false,
    orders: [],
    selected: [],
    dialog: false,

    companyId: -1,
    companyDialog: false,

    editedOrder: {},
    editOrderDialog: false,
  }),

  computed: {
    statuses() {
      return Object.values(orderStatuses);
    },

    sortedOrders() {
      let buff = [];

      if (this.activeOrderSortId === orderStatuses.active.id) {
        buff = this.orders.filter(value => !value.amount);
      } else if (this.activeOrderSortId === orderStatuses.completed.id) {
        buff = this.orders.filter(value => !!value.amount);
      } else {
        buff = this.orders;
      }

      return buff
        .sort(sortDesc)
        .map((value, index) => {
          const formatedDate = formatDate(value.date);
          const data = {
            ...value,
            index: index + 1,
            date: formatedDate,
            status: this.getStatus(value),
          };

          return data;
        });
    },
  },

  async beforeMount() {
    this.orders = await getOrders();
  },

  methods: {
    isAdmin,

    selectRow(order) {
      this.editedOrder = order;
      this.editOrderDialog = true;
    },

    getStatus(item) {
      if (!item.amount) {
        return orderStatuses.active;
      }

      return orderStatuses.completed;
    },

    async onSubmit(orderId) {
      this.dialog = false;

      const orders = await getOrdersByIds(orderId);

      if (orders.length) {
        this.orders.push(...orders);
      }
    },

    onEditSubmit(order) {
      const copy = [...this.orders];
      const index = this.orders.findIndex(value => value.id === order.id);

      copy[index] = order;
      this.orders = copy;
      this.editedOrder = {};
      this.editOrderDialog = false;
    },

    async deleteOrder(order) {
      if (!isAdmin()) {
        return;
      }
      // eslint-disable-next-line no-restricted-globals
      const result = confirm(`Вы дейстивительно хотите удалить ${order.item.name}?`);

      if (!result) {
        return;
      }

      const success = await removeOrder(order.id);

      if (success) {
        this.orders = this.orders.filter(value => value.id !== order.id);
      }
    },
  },
};
</script>

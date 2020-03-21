<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-toolbar color="green lighten-3">
          <v-toolbar-title v-if="$vuetify.breakpoint.smAndUp">{{ title }}</v-toolbar-title>
          <v-divider v-if="$vuetify.breakpoint.smAndUp" class="mx-4" inset vertical></v-divider>
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
          <v-spacer></v-spacer>
          <span :class="['d-flex', {
            'w-200': $vuetify.breakpoint.smAndUp,
            'w-100': $vuetify.breakpoint.xs,
            }
          ]">
            <v-text-field append-icon="mdi-magnify"
              dense label="Поиск"
              hide-details v-model="search"></v-text-field>
          </span>
        </v-toolbar>
        <v-divider></v-divider>
        <v-progress-linear
          :active="loading"
          indeterminate
          color="green lighten-3"
          height="7px"
          opacity="0.3"
        ></v-progress-linear>
        <v-simple-table
          fixed-header
          dense
          class="elevation-10"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  v-for="header in headers"
                  :key="header.text"
                  :width="header.width"
                  v-show="header.breakpoint()"
                >
                  {{ header.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(order, i) in sortedOrders" :key="order.id">
                <td v-if="headers[0].breakpoint()">{{ offset + i + 1 }}</td>
                <td>
                  {{ order.item.name }}
                  <span class="show-on-hover" v-if="isAdmin()">
                    <v-icon @click="editOrder(order)" color="gray" small>mdi-lead-pencil</v-icon>
                  </span>
                </td>
                <td>{{ order.amount || 0 }} / {{ order.orderAmount }}</td>
                <td>{{ order.date | date }}</td>
                <td>
                  <v-icon
                    color="green"
                    small
                    @click.stop="companyId = order.item.companyId; companyDialog = true"
                  >
                    mdi-information
                  </v-icon>
                  <v-icon :color="order.status.color" small>{{ order.status.icon }}</v-icon>
                </td>
              </tr>
            </tbody>
            <tfoot class="green lighten-3">
              <tr>
                <td :colspan="headers.length">
                   <v-pagination
                      v-if="totalPages > 1"
                      bottom
                      color="dark green"
                      v-model="page"
                      :length="totalPages"
                      :total-visible="7"
                    ></v-pagination>
                </td>
              </tr>
            </tfoot>
          </template>
        </v-simple-table>
      </v-flex>
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
      <OrderForm
        :dialog="dialog"
        @submit="onSubmit"
        @close="dialog = false"
      />
    </v-layout>
    <v-btn
      v-if="isAdmin()"
      small
      fixed
      dark
      fab
      bottom
      right
      color="green"
      @click="dialog = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import api from '../api';
import constants from '../constants/data.json';
import { sortDesc } from '../helpers/dates';

import OrderForm from '../components/order/OrderForm.vue';
import EditOrderFormModal from '../components/order/EditOrderFormModal.vue';
import CompanyInfoModal from '../components/company/CompanyInfoModal.vue';

const {
  isAdmin,
  getOrders,
  removeOrder,
} = api;

const orderStatuses = {
  active: {
    id: 0,
    value: true,
    name: 'В ожидании',
    icon: 'mdi-calendar-clock',
    color: 'orange',
  },
  completed: {
    id: 1,
    value: false,
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

  data: vm => ({
    selectedRow: null,
    editRow: false,
    search: '',
    constants,
    activeOrderSortId: orderStatuses.active.id,

    headers: [
      { text: '№', width: '5%', breakpoint: () => vm.$vuetify.breakpoint.smAndUp },
      { text: 'Наименование', width: '70%', breakpoint: () => true },
      { text: 'Пришло / Заказано', width: '10%', breakpoint: () => true },
      { text: 'Дата', width: '10%', breakpoint: () => true },
      { text: 'Статус', width: '5%', breakpoint: () => true },
    ],

    page: 1,
    limit: 20,
    timeout: null,
    totalPages: 1,

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
      return this.orders.slice(0)
        .sort(sortDesc)
        .map((value) => {
          const data = {
            ...value,
            status: this.getStatus(value),
          };

          return data;
        });
    },

    offset() {
      return this.limit * (this.page - 1);
    },
  },

  beforeMount() {
    this.loadOrders();
  },

  watch: {
    page() {
      this.loadOrders();
    },
    activeOrderSortId() {
      this.page = 1;
      this.loadOrders();
    },
    search() {
      this.page = 1;
      this.loadOrders();
    },
  },

  methods: {
    isAdmin,

    async loadOrders() {
      const query = {
        offset: this.offset,
        limit: this.limit,
        active: this.statuses[this.activeOrderSortId].value,
        search: this.search,
      };

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(async () => {
        this.loading = true;
        const { data, count } = await getOrders(query);

        this.orders = data;
        this.totalPages = Math.ceil(+count / this.limit);
        this.loading = false;
      }, 300);
    },

    editOrder(order) {
      this.editedOrder = order;
      this.editOrderDialog = true;
    },

    getStatus(item) {
      if (!item.amount) {
        return orderStatuses.active;
      }

      return orderStatuses.completed;
    },

    async onSubmit() {
      this.dialog = false;

      this.loadOrders();
    },

    onEditSubmit(order) {
      const copy = [...this.orders];
      const index = this.orders.findIndex(value => value.id === order.id);

      copy[index] = order;
      this.orders = copy;
      this.editedOrder = {};
      this.editOrderDialog = false;
      this.loadOrders();
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

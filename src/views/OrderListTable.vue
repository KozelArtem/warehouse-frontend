<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <Toolbar
          color="green lighten-3"
          :loading="isLoading"
          title="Заказы"
          @search="onSearchChange"
        >
          <template v-slot:afterTitle>
            <span style="width: 200px">
              <v-select
                v-model="active"
                :items="statuses"
                menu-props="auto"
                label="Статус"
                hide-details
                prepend-icon="mdi-sort"
                single-line
              ></v-select>
            </span>
          </template>
        </Toolbar>
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
              <tr v-for="(order, i) in purchaseList" :key="order.id">
                <td v-if="headers[0].breakpoint()">{{ getIndex(i) }}</td>
                <td>
                  {{ order.item.name }}
                  <span class="show-on-hover" v-if="isAdmin">
                    <v-icon @click="editOrder(order)" color="gray" small>mdi-lead-pencil</v-icon>
                  </span>
                </td>
                <td>{{ order.amount || 0 }} / {{ order.orderAmount }}</td>
                <td>{{ order.date | date }}</td>
                <td>
                  <v-icon v-if="order.active" color="orange" small>mdi-calendar-clock</v-icon>
                  <v-icon v-else color="green" small>mdi-check</v-icon>

                  <v-icon
                    v-if="order.companyId"
                    color="green"
                    small
                    @click.stop="openCompanyInfo(order)"
                  >
                    mdi-information
                  </v-icon>
                </td>
              </tr>
            </tbody>
            <tfoot class="green lighten-3">
              <TablePagination
                :headersLength="headers.length"
                :totalPages="totalPages"
                color="dark green"
                @change="pageChange"
              />
            </tfoot>
          </template>
        </v-simple-table>
      </v-flex>
      <CompanyInfoModal
        v-if="companyInfo.dialog"
        :companyId="companyInfo.id || 0"
        @close="companyInfo.dialog = false"
      />
      <OrderForm
        v-if="orderForm.dialog"
        :title="orderForm.title"
        :input="orderForm.order"
        @submit="onOrderFormSubmit"
        @close="closeOrderForm"
      />
    </v-layout>
    <v-btn
      v-if="isAdmin"
      small
      fixed
      dark
      fab
      bottom
      right
      color="green"
      @click="orderForm.dialog = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { PURCHASE_NAMESPACE, AUTH_NAMESPACE } from '../store/namespaces';

export default {
  components: {
    Toolbar: () => import('../components/helpers/Toolbar.vue'),
    TablePagination: () => import('../components/helpers/TablePagination.vue'),
    OrderForm: () => import('../components/order/OrderForm.vue'),
    CompanyInfoModal: () => import('../components/company/CompanyInfoModal.vue'),
  },

  data: vm => ({
    query: {
      search: '',
      active: true,
      limit: 10,
      offset: 0,
    },

    active: true,
    page: 1,

    headers: [
      { text: '№', width: '5%', breakpoint: () => vm.$vuetify.breakpoint.smAndUp },
      { text: 'Наименование', width: '70%', breakpoint: () => true },
      { text: 'Пришло / Заказано', width: '10%', breakpoint: () => true },
      { text: 'Дата', width: '10%', breakpoint: () => true },
      { text: 'Статус', width: '5%', breakpoint: () => true },
    ],
    statuses: [
      { text: 'В ожидании', value: true },
      { text: 'Завершенные', value: false },
    ],

    orderForm: {
      dialog: false,
    },

    companyInfo: {
      id: -1,
      dialog: false,
    },
  }),

  computed: {
    ...mapGetters(PURCHASE_NAMESPACE, ['totalPages', 'purchaseList', 'isLoading']),
    ...mapGetters(AUTH_NAMESPACE, ['isAdmin']),
  },

  beforeMount() {
    this.fetchPurchases(this.query);
  },

  watch: {
    query: {
      deep: true,
      handler() {
        this.fetchPurchases(this.query);
      },
    },
    active() {
      this.query.active = this.active;
    },
  },

  methods: {
    ...mapActions(PURCHASE_NAMESPACE, ['fetchPurchases', 'createPurchase', 'updatePurchase']),

    onSearchChange(search) {
      this.query.search = search;
    },

    getIndex(i) {
      return this.query.limit * (this.page - 1) + i + 1;
    },

    editOrder(order) {
      this.orderForm = {
        edit: true,
        order,
        title: 'Редактирование заказа',
        dialog: true,
      };
    },

    openCompanyInfo(order) {
      this.companyInfo = {
        id: order.companyId,
        dialog: true,
      };
    },

    closeOrderForm() {
      this.orderForm = { dialog: false };
    },

    onOrderFormSubmit() {
      this.closeOrderForm();
    },

    pageChange({ limit, offset, page }) {
      this.page = page;
      this.query = { ...this.query, limit, offset };
    },
  },
};
</script>

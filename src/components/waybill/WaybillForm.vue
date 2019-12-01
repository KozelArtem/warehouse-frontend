<template>
  <v-form v-model="valid">

    <OrderForm
      v-if="newOrderDialog"
      :dialog="newOrderDialog"
      @close="newOrderDialog = false"
      @submit="addOrder"
    />

    <v-container grid-list-xs>
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field
            label="Номер"
            hide-details
            dense
            v-model="waybill.number"
            :rules="[required, minLength]"
          />
        </v-flex>
        <v-flex xs6>
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
                  <td>{{ order.date }}</td>
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

import dates from '../../helpers/dates';
import rules from '../../helpers/validationRules';

const {
  getActiveOrders,
  getOrdersByIds,
  createWaybill,
} = api;

const {
  icons,
} = constants;

const {
  format: formatDate,
  sortDesc,
} = dates;

export default {
  components: {
    OrderForm: () => import('../order/OrderForm.vue'),
  },

  data: () => ({
    ...icons,
    ...rules,

    newOrderDialog: false,

    valid: false,
    loading: false,
    datePickerMenu: false,
    waybill: {},
    waybillTemplate: {
      number: '',
      date: formatDate(Date.now(), 'YYYY-MM-DD'),
      orders: [],
    },
    orders: [],
  }),

  beforeMount() {
    this.waybill = { ...this.waybillTemplate };
    this.loadOrders();
  },

  computed: {
    selectedOrdersCount() {
      return this.orders.filter(order => order.selected).length;
    },
  },

  methods: {
    async addOrder(orderId) {
      this.newOrderDialog = false;

      const data = await getOrdersByIds(orderId);
      const order = { ...data[0], selected: true, date: formatDate(data[0].date) };

      this.orders.unshift(order);
    },

    async loadOrders() {
      const data = await getActiveOrders();
      this.orders = data
        .map(order => ({
          ...order,
          date: formatDate(order.date),
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
      if (this.valid) {
        return;
      }

      this.waybill.orders = this.orders.filter(order => order.selected);

      const waybillFromAPI = await createWaybill(this.waybill);

      if (waybillFromAPI) {
        this.waybill = { ...this.waybillTemplate };
        this.$emit('submit', waybillFromAPI);
      }
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

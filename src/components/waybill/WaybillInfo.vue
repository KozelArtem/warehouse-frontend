<template>
  <v-simple-table dense class="max-height-60" fixed-header>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Наименование</th>
          <th class="text-left">Количество</th>
          <th class="text-left">Дата заказа</th>
          <th class="text-left">Компания</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="purchase in waybill.purchases"
          :key="purchase.id"
        >
          <td>{{ purchase.item.name }}</td>
          <td>{{ purchase.amount }}</td>
          <td>{{ purchase.date }}</td>
          <td>{{ (purchase.item.company || {}).name }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import api from '../../api';

import dates from '../../helpers/dates';

const {
  getWaybillInfo,
} = api;

const { format: formatDate } = dates;


export default {
  props: {
    id: {
      type: Number,
      required: true,
      validator: value => value > 0,
    },
  },

  data: () => ({
    waybill: {},
  }),

  beforeMount() {
    this.loadWaybill();
  },

  watch: {
    id() {
      this.loadWaybill();
    },
  },

  methods: {
    async loadWaybill() {
      const data = await getWaybillInfo(this.id);
      const purchases = data.purchases.map(value => ({ ...value, date: formatDate(value.date) }));

      this.waybill = { ...data, purchases };
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

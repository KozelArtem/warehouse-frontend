<template>
  <v-data-table
    :headers="headers"
    :items="mappedItems"
    class="elevation-1"
    item-key="id"
    :no-data-text="noData"
    :no-results-text="noResults"
    locale="ru-RU"
    dense
  >
    <template v-slot:item.waybillNumber="{ item }">
      <span v-if="!item.waybillNumber">
        Ожидание
      </span>
      <router-link v-else :to="`waybill/${item.waybillNumber}`">
        {{ item.waybillNumber }}
      </router-link>
    </template>
  </v-data-table>
</template>

<script>
import dateService from '../../helpers/dates';

import constant from '../../constants/data.json';

const { sortDesc: sortDate, format: formatDate } = dateService;

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },

  data: () => ({
    headers: [
      {
        text: '№',
        value: 'index',
        width: '20px',
        divider: true,
      },
      {
        text: 'Накладная',
        value: 'waybillNumber',
        sortable: false,
        divider: true,
      },
      {
        text: 'Дата',
        value: 'date',
        divider: true,
        sort: sortDate,
      },
      {
        text: 'Количество',
        value: 'amount',
        sortable: false,
        divider: true,
      },
    ],
    ...constant,
  }),

  computed: {
    mappedItems() {
      return this.items.map((item, index) => {
        const amount = item.amount > 0 ? item.amount : item.orderAmount;
        const date = formatDate(item.date);

        return {
          ...item,
          index: index + 1,
          date,
          amount,
          waybillNumber: (item.waybill || {}).number,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

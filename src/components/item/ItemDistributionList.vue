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
    <template v-slot:body.prepend="{ item }">
     <tr>
      <td><v-icon></v-icon></td>
      <td>
        <v-text-field
          name="name"
          label="label"
          id="id"
          hide-details
        ></v-text-field>
      </td>
      <td><v-text-field
        name="name"
        label="label"
        id="id"
        hide-details
      ></v-text-field></td>
      <td><v-text-field
        name="name"
        label="label"
        id="id"
        hide-details
      ></v-text-field>
      </td>
      <td>
       <v-icon color="green">mdi-content-save</v-icon>
      </td>
     </tr>
    </template>
  </v-data-table>
</template>

<script>
import moment from 'moment';

import sorting from '../../helpers/sorting';

import constant from '../../constants/data.json';

const { sortByDate } = sorting;

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
        text: 'Куда',
        value: 'placeName',
        sortable: false,
        divider: true,
      },
      {
        text: 'Когда',
        value: 'date',
        divider: true,
        sort: sortByDate,
      },
      {
        text: 'Сколько',
        value: 'amount',
        sortable: false,
        divider: true,
      },
    ],
    ...constant,
  }),

  computed: {
    mappedItems() {
      console.log('123');

      return this.items.map((item, index) => ({
        ...item,
        index: index + 1,
        date: moment().format('DD.MM.YYYY'),
        placeName: item.place.name,
      }));
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

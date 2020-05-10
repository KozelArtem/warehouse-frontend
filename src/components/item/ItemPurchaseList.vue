<template>
  <div>
    <v-alert v-if="!mappedItems.length" type="info" outlined :value="true">
      Нет заказов
      <v-btn
        v-if="isAdmin"
        class="float-right"
        small
        color="success"
        outlined
        @click="$router.push('/')"
      >
        Добавить
      </v-btn>
    </v-alert>
    <v-simple-table v-else dense class="elevation-10">
      <template v-slot:default>
        <thead>
          <tr>
            <th
              class="body-2 font-weight-bold"
              v-for="(header, i) in headers"
              :key="`header${i}`"
              :width="header.width"
            >
              {{ header.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in mappedItems" :key="item.id">
            <td>{{ i + 1 }}</td>
            <td>
              <span v-if="!item.waybillNumber">
                Ожидание
              </span>
              <router-link v-else :to="`waybill/${item.waybill.id}`">
                {{ item.waybillNumber }}
              </router-link>
            </td>
            <td>{{ item.date | date }}</td>
            <td>{{ item.amount }} </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { AUTH_NAMESPACE } from '../../store/namespaces';

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },

  data: () => ({
    headers: [
      { name: '№', width: '10%' },
      { name: 'Накладная', width: '30%' },
      { name: 'Дата', width: '30%' },
      { name: 'Количество', width: '20%' },
    ],
  }),

  computed: {
    ...mapGetters(AUTH_NAMESPACE, ['isAdmin']),

    mappedItems() {
      return this.items.map((item, index) => {
        const amount = item.amount > 0 ? item.amount : item.orderAmount;

        return {
          ...item,
          index: index + 1,
          amount,
          waybillNumber: (item.waybill || {}).number,
        };
      });
    },
  },
};
</script>

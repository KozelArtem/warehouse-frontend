<template>
  <v-simple-table dense class="elevation-5" style="position: relative">
    <template v-slot:default>
      <thead>
        <tr align="center" valign="center">
          <td colspan="100%" class="title">
            Заказы
          </td>
        </tr>
        <tr>
          <th
            v-for="(header, i) in headers"
            :key="i"
            class="subtitle-2 font-weight-black"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <PurchaseLine
          v-for="purchase in localPurchases"
          :key="purchase.id"
          v-model="purchase.selected"
          :purchase="purchase"
          @input="updatePurchases"
        />
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import { mapGetters } from 'vuex';
import { PURCHASE_NAMESPACE } from '../../store/namespaces';

export default {
  components: {
    PurchaseLine: () => import('./PurchaseLine.vue'),
  },

  props: {
    companyId: {
      type: [Number, String],
      required: false,
      default: null,
    },
  },
  data: () => ({
    headers: [
      '',
      'Наименование',
      'Дата',
      'Заказано',
      'Пришло',
      '',
    ],
  }),

  computed: {
    ...mapGetters(PURCHASE_NAMESPACE, ['purchaseList']),

    localPurchases() {
      return this.purchaseList
        .slice(0)
        .filter((item) => {
          if (item.companyId && this.companyId) {
            return item.companyId === this.companyId;
          }

          return !item.companyId;
        })
        .map(item => ({
          ...item,
          selected: !!item.companyId,
          orderAmount: item.orderAmount,
          amount: (item.amount && item.amount) || item.orderAmount,
        }));
    },
  },

  methods: {
    updatePurchases() {
      const selectedPurchases = this.localPurchases.filter(i => i.selected);

      this.$emit('update', selectedPurchases);
    },
  },
};
</script>

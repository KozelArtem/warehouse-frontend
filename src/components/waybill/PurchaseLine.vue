<template>
  <tr :class="{ 'green lighten-4': selected }">
    <td width="5%">
      <v-checkbox hide-details dense class="shrink mt-0" v-model="selected" />
    </td>
    <td width="55%">
      {{ localPurchase.item.name }}
      <v-tooltip bottom v-if="!localPurchase.companyId">
        <template v-slot:activator="{ on }">
          <v-icon color="red" small dark v-on="on">mdi-information-outline</v-icon>
        </template>
      <span>Заказ без компании</span>
    </v-tooltip>

    </td>
    <td width="15%">
      {{ localPurchase.date | date }}
    </td>
    <td width="10%">
      <v-text-field
        disabled
        dense
        class="pb-1"
        hide-details
        :value="localPurchase.orderAmount"
      ></v-text-field>
    </td>
    <td width="10%">
      <v-text-field
        dense
        min="0"
        hide-details
        class="pb-1"
        :required="true"
        type="number"
        v-model="localPurchase.amount"
      ></v-text-field>
    </td>
    <td width="5%">
      <v-icon color="success" v-if="isValidPurchase">
        mdi-check
      </v-icon>
      <v-icon color="warning" v-else>mdi-calendar-alert</v-icon>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
      default: true,
    },
    purchase: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  data: () => ({
    localPurchase: {},
    selected: false,
  }),

  beforeMount() {
    this.localPurchase = { ...this.purchase };
    this.selected = this.value;
  },

  computed: {
    isValidPurchase() {
      return +this.localPurchase.amount === +this.localPurchase.orderAmount;
    },
  },

  watch: {
    selected() {
      this.$emit('input', this.selected);
    },
  },
};
</script>

<template>
  <v-tabs
    v-model="selectedMonthId"
    grow
    center-active
  >
    <v-tab
      v-for="(month, i) in months"
      :key="month"
      @change="$emit('change', i)"
    >
      {{ month }}
    </v-tab>
  </v-tabs>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    value: {
      type: Number,
      required: true,
      default: moment().month(),
    },
  },

  data: vm => ({
    months: moment.months(),
    selectedMonthId: vm.value,
  }),
};
</script>

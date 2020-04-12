<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="date"
        :label="label"
        hide-details
        dense
        readonly
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="date"
      @input="menu = false"
      :min="min"
      :max="max"
      first-day-of-week="1"
      locale="ru-RU"
    />
  </v-menu>
</template>

<script>
import moment from 'moment';

import { format as formatDate } from '../../helpers/dates';

const DATE_FORMAT = 'YYYY-MM-DD';

const today = moment().format('YYYY-MM-DD');

export default {
  props: {
    value: {
      type: [Date, String, Number],
      required: false,
      default: Date.now(),
    },
    label: {
      type: String,
      required: false,
      default: 'Дата',
    },
    min: {
      type: [Date, String],
      required: false,
      default: '',
    },
    max: {
      type: [Date, String],
      required: false,
      default: today,
    },
  },

  data: () => ({
    menu: false,
    date: null,
  }),

  beforeMount() {
    this.date = formatDate(this.value, DATE_FORMAT);
  },

  watch: {
    date() {
      this.$emit('input', this.date);
    },
    value() {
      this.date = formatDate(this.value, DATE_FORMAT);
    },
  },
};
</script>

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
    initDate: {
      type: [Date, String],
      required: false,
      default: today,
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
    this.date = this.initDate;
  },

  watch: {
    date() {
      this.$emit('update', this.date);
    },
    initDate() {
      this.initDate = formatDate(this.initDate, DATE_FORMAT);
    },
  },
};
</script>

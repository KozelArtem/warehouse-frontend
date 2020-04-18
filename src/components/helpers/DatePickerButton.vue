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
      <v-btn
        v-if="!date"
        small text :color="color"
        v-on="on"
      >
        {{ emptyDateText }}
      </v-btn>
      <v-btn small text :color="color" v-on="on" v-else>
        {{ date | date }}
      </v-btn>
    </template>
    <v-date-picker
      :color="bgColor"
      first-day-of-week="1"
      :max="max"
      v-model="date"
      @input="menu = false"
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
    emptyDateText: {
      type: String,
      required: false,
      default: 'Выбрать дату',
    },
    bgColor: {
      type: String,
      required: false,
      default: 'white',
    },
    color: {
      type: String,
      required: false,
      default: 'black',
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

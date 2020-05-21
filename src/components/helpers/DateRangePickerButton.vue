<template>
  <div>
    <v-menu
      offset-y
      bottom right
      :nudge-bottom="13"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn block v-on="on" text class="font-weight-black">
          <v-icon :color="buttonColor">mdi-calendar</v-icon>
        </v-btn>
      </template>
      <v-date-picker
        v-model="dateRange"
        type="month"
        :color="color"
        :max="today"
        landscape
        :title-date-format="format"
        multiple
        fullscreen
        range
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    value: {
      type: Array,
      required: false,
      default: () => [moment().format('YYYY-MM')],
    },
    color: {
      type: String,
      required: false,
      default: 'white',
    },
    buttonColor: {
      type: String,
      required: false,
      default: 'black',
    },
  },

  beforeMount() {
    if ((this.value || []).length) {
      this.dateRange = [...this.value];
    }
    this.$emit('input', this.formatedPeriod);
  },

  data: () => ({
    today: moment().format(),

    dateRange: [moment().format('YYYY-MM')],
  }),

  computed: {
    period() {
      return this.dateRange.slice(0).sort((a, b) => moment(a).diff(moment(b)));
    },

    formatedPeriod() {
      const [start, end] = this.period;

      return [
        moment(start).startOf('month').format(),
        moment(end || start).endOf('month').format(),
      ];
    },
  },

  watch: {
    dateRange() {
      this.$emit('input', this.formatedPeriod);
    },
  },

  methods: {
    format() {
      const [start, end] = this.period;

      return `${moment(start).format('YYYY-MM')} \n ${moment(end).format('YYYY-MM')}`;
    },
  },
};
</script>

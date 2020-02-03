<template>
  <v-dialog
    value="true"
    scrollable
    :fullscreen="fullscreen"
    :width="$vuetify.breakpoint.xs ? '100%' : '700px'"
    no-click-animation
    transition="dialog-transition"
    @click:outside="showList()"
  >
    <v-card>
      <v-card-title class="purple white--text darken-3">
        <span class="headline">
          <span v-if="loading">Загрузка...</span>
          <span v-else>{{ waybill.number }} от {{ waybill.date | date }}</span>
        </span>
        <v-spacer></v-spacer>
        <v-icon color="white" @click="showFullscreen = !showFullscreen">
          {{ fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}
        </v-icon>
        <v-icon color="red" @click="showList()">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-simple-table dense class="max-height-60" fixed-header>
          <template v-slot:default>
            <thead>
              <tr v-if="loading">
                <v-progress-linear
                  active
                  indeterminate
                  absolute
                  bottom
                  color="green accent-4"
                ></v-progress-linear>
              </tr>
              <tr v-else>
                <th class="text-left">Наименование</th>
                <th class="text-left">Кол-во</th>
                <th class="text-left">Дата заказа</th>
                <th class="text-left">Компания</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="purchase in waybill.purchases"
                :key="purchase.id"
              >
                <td>{{ purchase.item.name }}</td>
                <td>{{ purchase.amount }}</td>
                <td>{{ purchase.date }}</td>
                <td>{{ (purchase.item.company || {}).name }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '../../api';

import { format as formatDate } from '../../helpers/dates';

const {
  getWaybillInfo,
} = api;

export default {
  props: {
    id: {
      type: [Number, String],
      required: true,
      validator: value => value > 0,
    },
  },

  data: () => ({
    waybill: {},
    showFullscreen: false,
    loading: true,
  }),

  computed: {
    fullscreen() {
      return this.showFullscreen || this.$vuetify.breakpoint.xs;
    },

    title() {
      const { number, date } = this.waybill;

      return this.loading ? 'Загрузка...' : `${number} от ${date}`;
    },
  },

  beforeMount() {
    this.loadWaybill();
  },

  watch: {
    id() {
      this.loadWaybill();
    },
  },

  methods: {
    async loadWaybill() {
      this.loading = true;

      const data = await getWaybillInfo(this.id);
      const purchases = data.purchases.map(value => ({ ...value, date: formatDate(value.date) }));

      this.waybill = { ...data, purchases };
      this.loading = false;
    },

    showList() {
      this.$router.push({ name: 'waybillList' });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

<template>
  <v-card v-if="item">
    <v-card-title class="subtitle-1 grey lighten-2" primary-title>
      <v-flex xs11>
        <span>{{ title }}</span>
      </v-flex>
      <v-flex xs1>
        <v-icon class="text-right" color="red" @click="$emit('close')">mdi-close</v-icon>
      </v-flex>
    </v-card-title>
    <v-card-text>
    </v-card-text>
    <v-card-actions>
      <ItemPurchaseList :items="item.purchases">
      <ItemDistributionList :items="item.distributions">
    </v-card-actions>
  </v-card>
</template>

<script>
import api from '../api';

const {
  getItemInfo,
} = api;

export default {
  components: {},
  props: {
    itemId: {
      type: [Number, String],
      default: 0,
      required: true,
    },
  },

  async beforeMount() {
    await this.loadItem();
  },

  data: () => ({
    item: {},
  }),

  computed: {
    title() {
      return this.item.name ? `${this.item.category.name} - ${this.item.name}` : 'Загрузка...';
    },
  },

  watch: {
    async itemId() {
      await this.loadItem();
    },
  },

  methods: {
    async loadItem() {
      const data = await getItemInfo(this.itemId);

      this.item = data;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

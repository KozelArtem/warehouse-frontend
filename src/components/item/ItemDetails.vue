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
    <v-img contain :src="item.imagePath || ''" max-height="200">
    </v-img>
    <v-card-text>
      <div>
      </div>
      <v-tabs>
        <v-tab>Заказ</v-tab>
        <v-tab>Расход</v-tab>
        <v-spacer></v-spacer>
        <span class="headline green--text">{{ item.amount }}  </span>
        <v-tab-item>
          <ItemPurchaseList :items="item.purchases" />
        </v-tab-item>
        <v-tab-item>
          <ItemDistributionList :items="item.distributions" />
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script>
import api from '../../api';

import ItemPurchaseList from './ItemPurchaseList.vue';
import ItemDistributionList from './ItemDistributionList.vue';

const {
  getItemInfo,
} = api;

export default {
  components: {
    ItemPurchaseList,
    ItemDistributionList,
  },

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

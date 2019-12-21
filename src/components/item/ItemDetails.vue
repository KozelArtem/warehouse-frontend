<template>
  <v-card v-if="item">
    <DeleteModal
      v-if="removeModal"
      :dialog="removeModal"
      title="Удаление элемента"
      :description="removeModalDescription"
      @click="closeRemoveModal"
    />
    <ItemModal
      :dialog="editDialog"
      :data="item"
      @close="editDialog = false"
      @submit="itemModalSubmit"
    />
    <CompanyInfoModal
      v-if="showCompanyInfo"
      :dialog="showCompanyInfo"
      :companyId="item.companyId || -1"
      @close="showCompanyInfo = false"
    />
    <v-card-title class="subtitle-1 grey lighten-2 wrapper" primary-title>
      <v-flex>
        <span>{{ title }}</span>
        <span class="control-panel" v-if="isAdmin()">
          <v-icon @click="editDialog = true" color="primary">mdi-pencil</v-icon>
          <v-icon @click="removeElement(item)" color="red">mdi-delete</v-icon>
        </span>
      </v-flex>
      <v-flex class="text-right">
      <span class="pa-0 ma-0" stype="right: 0; top: 0">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              color="green"
              size="20"
              v-on="on"
              @click.stop="showCompanyInfo = true"
            >
              mdi-information
            </v-icon>
          </template>
          <span>Информация о компании</span>
        </v-tooltip>
        <v-icon class="text-right" size="20" color="red" @click="$emit('close')">mdi-close</v-icon>
      </span>
      </v-flex>
    </v-card-title>
    <v-img contain :src="item.imagePath || ''" height="200" style="cursor: pointer;"
      @click="imageFullSizeDialog = true">
      <v-dialog
        v-model="imageFullSizeDialog"
        scrollable
        :overlay="false"
        transition="dialog-transition"
      >
        <v-card>
          <v-img :src="item.imagePath || ''" @click="imageFullSizeDialog = false"></v-img>
        </v-card>
      </v-dialog>
    </v-img>
    <v-card-text>
    <v-divider color="green"></v-divider>
      <div>
      </div>
      <v-tabs>
        <v-tab>Заметка</v-tab>
        <v-tab>Заказ</v-tab>
        <v-tab>Расход</v-tab>
        <v-tab>Ссылки</v-tab>
        <v-spacer></v-spacer>
        <v-chip class="headline font-weight-black white--text mt-2"
          label readonly color="green">
          {{ item.amount }}</v-chip>

        <v-tab-item class="pa-4">
          <span v-for="row in (item.note || '').split('\n')" :key="row" class="black--text">
            {{ row }}
            <br>
          </span>
        </v-tab-item>

        <v-tab-item>
          <ItemPurchaseList :items="item.purchases" />
        </v-tab-item>
        <v-tab-item>
          <ItemDistributionList
            :itemId="item.id"
            :items="item.distributions"
            @submit="newItemDistribution"
          />
        </v-tab-item>
        <v-tab-item class="pa-4">
          <a
            v-for="(url, ind) in item.urls"
            :key="`url${ind}`"
            :href="url.data"
            target="_blank"
          >
            {{ url.name }}
          </a>
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
  isAdmin,
  getItemInfo,
  removeItem,
} = api;

export default {
  components: {
    ItemModal: () => import('./ItemModal.vue'),
    ItemPurchaseList,
    ItemDistributionList,
    CompanyInfoModal: () => import('../company/CompanyInfoModal.vue'),
    DeleteModal: () => import('../helpers/DeleteModal.vue'),
  },

  props: {
    itemId: {
      type: [Number, String],
      default: 0,
      required: true,
    },
  },

  async beforeMount() {
    this.localItemId = this.itemId;

    await this.loadItem();
  },

  data: () => ({
    editDialog: false,
    showCompanyInfo: false,
    item: {},
    localItemId: 0,
    imageFullSizeDialog: false,

    removeModal: false,
    removeModalDescription: null,
  }),

  computed: {
    title() {
      return this.item.name ? `${this.item.category.name} - ${this.item.name}` : 'Загрузка...';
    },
  },

  watch: {
    async itemId() {
      if (this.itemId > 0) {
        this.localItemId = this.itemId;

        await this.loadItem();
      }
    },
  },

  methods: {
    isAdmin,
    async loadItem() {
      const data = await getItemInfo(this.localItemId);

      this.item = data;
    },

    itemModalSubmit(itemId) {
      this.localItemId = itemId;
      this.editDialog = false;
      this.loadItem();
    },

    newItemDistribution(itemDist) {
      this.item.distributions.unshift(itemDist);
      this.item.amount -= itemDist.amount;
    },

    removeElement() {
      this.removeModal = true;
      this.removeModalDescription = `Вы действительно хотите удалить ${this.item.name}?`;
    },

    async closeRemoveModal(result) {
      if (result) {
        await removeItem(this.item.id);
        this.$emit('close');
        this.item = {};
      }

      this.removeModal = false;
    },
  },
};
</script>

<style lang="scss">
.wrapper {
  .control-panel {
    display: none;
  }

  &:hover {
    .control-panel {
      display: inline;
    }
  }
}
</style>

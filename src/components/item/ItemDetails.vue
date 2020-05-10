<template>
  <div>
    <DeleteModal
      v-if="removeModal.dialog"
      title="Удаление элемента"
      :description="removeModal.description"
      @click="closeRemoveModal"
    />
    <ItemModal
      v-if="editModal"
      :data="itemInfo"
      @close="editModal = false"
      @submit="itemModalSubmit"
    />
    <v-card>
      <Toolbar
        :title="title"
        :loading="isLoading"
      >
        <template v-slot:title>
          <router-link :to="`/categories/${itemInfo.categoryId}`" class="body-2">
            {{ itemInfo.category && itemInfo.category.name }}
          </router-link>
        </template>
        <template v-slot:afterTitle>
          <span class="subtitle-2">{{ itemInfo.name }}</span>
        </template>
        <template v-slot:right>
          <span
            class="font-weight-bold headline"
            :class="{
              'green--text': itemInfo.amount > 10,
              'orange--text': itemInfo.amount < 5 && itemInfo.amount > 0,
              'red--text': itemInfo.amount < 1,
            }"
          >
            {{ itemInfo.amount }}
          </span>
          <v-divider vertical inset class="mx-2"></v-divider>
          <DropdownMenu
            v-if="isAdmin"
            icon="mdi-dots-horizontal"
            @update="editModal = true"
            @remove="showRemoveModal"
          />
        </template>
      </Toolbar>
      <v-tabs vertical icons-and-text>
        <v-tab>
          Информация
          <v-icon>mdi-image</v-icon>
        </v-tab>
        <v-tab>
          Заказы
          <v-icon>mdi-file</v-icon>
        </v-tab>
        <v-tab>
          Расходы
          <v-icon>mdi-file-document</v-icon>
        </v-tab>
        <v-tab-item>
          <v-card flat>
            <div class="d-flex flex-wrap">
              <div>
                <v-avatar
                  class="ma-3"
                  size="200"
                  tile
                >
                  <ImageWithFullView :src="itemInfo.imagePath" />
                </v-avatar>
              </div>
              <div>
                <v-card-title class="subtitle-1">Описание:</v-card-title>
                <v-card-subtitle>
                  <span v-for="row in (itemInfo.note || '').split('\n')" :key="row">
                    {{ row }}
                    <br>
                  </span>
                </v-card-subtitle>

                <v-card-title class="subtitle-1">Ссылки:</v-card-title>
                <v-card-subtitle>
                  <ol>
                    <li v-for="(url, ind) in itemInfo.urls" :key="`url${ind}`">
                      <a :href="url.data" target="_blank">{{ url.name }}</a>
                    </li>
                  </ol>
                </v-card-subtitle>
              </div>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <ItemPurchaseList
                :items="itemInfo.purchases"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <ItemDistributionList
                :itemId="itemInfo.id"
                :items="itemInfo.distributions || []"
                @submit="newItemDistribution"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { ITEM_NAMESPACE, AUTH_NAMESPACE } from '../../store/namespaces';

import Toolbar from '../helpers/Toolbar.vue';
import DropdownMenu from '../helpers/DropdownMenu.vue';
import ImageWithFullView from '../helpers/ImageWithFullView.vue';

export default {
  components: {
    Toolbar,
    DropdownMenu,
    ImageWithFullView,

    ItemModal: () => import('./ItemModal.vue'),
    ItemPurchaseList: () => import('./ItemPurchaseList.vue'),
    ItemDistributionList: () => import('./ItemDistributionList.vue'),

    DeleteModal: () => import('../helpers/DeleteModal.vue'),
  },

  props: {
    itemId: {
      type: [Number, String],
      default: 0,
      required: true,
    },
  },

  data: () => ({
    editModal: false,

    removeModal: {
      dialog: false,
      description: '',
    },
  }),

  computed: {
    ...mapGetters(AUTH_NAMESPACE, ['isAdmin']),
    ...mapGetters(ITEM_NAMESPACE, ['isLoading', 'itemInfo']),

    title() {
      return this.itemInfo.name ? this.itemInfo.name : 'Загрузка...';
    },
  },

  watch: {
    itemId() {
      this.loadItem(this.itemId);
    },
  },

  beforeMount() {
    this.loadItem(this.itemId);
  },

  methods: {
    ...mapActions(ITEM_NAMESPACE, ['loadItem', 'removeItem']),

    itemModalSubmit() {
      this.editModal = false;

      this.loadItem(this.itemId);
    },

    newItemDistribution() {
      this.loadItem(this.itemId);
    },

    showRemoveModal() {
      this.removeModal = {
        dialog: true,
        description: `Вы действительно хотите удалить ${this.itemInfo.name}?`,
      };
    },

    closeRemoveModal(result) {
      if (result) {
        this.removeItem(this.itemId);
        this.$router.push(`/categories/${this.itemInfo.categoryId}`);
      }

      this.removeModal = {
        dialog: false,
        description: '',
      };
    },
  },
};
</script>

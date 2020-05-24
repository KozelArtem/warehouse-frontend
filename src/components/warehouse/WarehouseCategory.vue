<template>
  <div>
    <ItemModal
      v-if="modal"
      @close="closeModal()"
      @submit="onModalSubmit()"
      :category="category"
    />
    <v-layout row wrap>
      <v-flex xs12>
        <Toolbar
          color="white"
          :loading="isLoading"
          :title="category.name"
          :showSearch="false"
        >
          <template v-slot:afterTitle>
            <DropdownMenu
              v-if="isAdmin"
              color="black"
              icon="mdi-dots-horizontal"
              :fields="menuFields"
              @create="showCreateModal"
            />
          </template>
        </Toolbar>
      </v-flex>
      <v-flex xs12>
        <v-list dense>
          <v-list-item
            v-if="category.parentId"
            @click="openCategory(category.parentId)"
            class="grey lighten-2"
          >
            <v-list-item-avatar size="20">
              <v-icon>mdi-chevron-double-up</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>Назад в {{ category.parent.name }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
            </v-list-item-action>
          </v-list-item>
          <CategoryLine
            v-for="item in category.categories"
            :key="item.id"
            :value="item"
            icon="mdi-folder"
            @click="openCategory(item.id)"
          />

          <ItemLine
            v-for="item in category.items"
            :key="item.id"
            :value="item"
            icon="mdi-file"
            @click="openItem(item.id)"
          />
        </v-list>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { CATEGORY_NAMESPACE, AUTH_NAMESPACE } from '../../store/namespaces';

export default {
  components: {
    Toolbar: () => import('../helpers/Toolbar.vue'),
    DropdownMenu: () => import('../helpers/DropdownMenu.vue'),
    CategoryLine: () => import('./CategoryLine.vue'),
    ItemModal: () => import('../item/ItemModal.vue'),
    ItemLine: () => import('./ItemLine.vue'),
  },

  props: {
    categoryId: {
      type: [Number, String],
      required: true,
      default: 0,
      validator: value => value > 0,
    },
  },

  data: () => ({
    menuFields: ['create'],
    modal: false,
  }),

  computed: {
    ...mapGetters(CATEGORY_NAMESPACE, ['isLoading', 'category']),
    ...mapGetters(AUTH_NAMESPACE, ['isAdmin']),
  },

  async beforeMount() {
    this.fetchCategoryInfo(this.categoryId);
  },

  watch: {
    categoryId() {
      this.fetchCategoryInfo(this.categoryId);
    },
  },

  methods: {
    ...mapActions(CATEGORY_NAMESPACE, ['fetchCategoryInfo']),

    openCategory(categoryId) {
      this.$router.push(`/categories/${categoryId}`);
    },

    openItem(itemId) {
      this.$router.push(`/items/${itemId}`);
    },

    showCreateModal() {
      this.modal = true;
    },

    closeModal() {
      this.modal = false;
    },

    onModalSubmit() {
      this.fetchCategoryInfo(this.categoryId);
      this.closeModal();
    },
  },
};
</script>

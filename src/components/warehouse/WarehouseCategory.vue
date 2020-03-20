<template>
  <div class="pt-3">
    <v-toolbar dense @click="goBack()" v-if="showBackButton" class="pointer">
      <v-icon class="mr-3">mdi-arrow-left-bold</v-icon>
      <span class="d-flex">
        Назад
      </span>
      <v-spacer></v-spacer>
      <span class="d-flex">{{ category.name }}</span>
        <v-spacer></v-spacer>
    </v-toolbar>
    <v-progress-linear
      v-show="loading"
      color="light-blue"
      height="7"
      striped
      indeterminate
    ></v-progress-linear>
    <v-layout row wrap>
      <v-flex :xs4="itemOpened">
        <v-list dense
          :style="{ 'max-height': showBackButton ?  '74vh' : '81vh' }"
          class="overflow-y-auto"
        >
          <!-- Create new category -->
          <v-list-item v-if="newFolder.edit">
            <v-list-item-icon>
              <v-icon color="green">mdi-folder-open</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-text-field dense hide-details
                single-line v-model="newFolder.name"
                append-icon="mdi-close"
                append-outer-icon="mdi-content-save"
                @click:append="newFolder = {}"
                @click:append-outer="saveNewCategory"
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="categories.length"></v-divider>
          <!-- List of categories -->
          <!-- <v-menu
            close-on-click
            close-on-content-click
            v-for="(cat, i) in categories"
            :key="`cat${i}`"
          >
            <template v-slot:activator="{ on }"> -->
              <v-list-item
                v-for="(cat, i) in categories"
                :key="`cat${i}`"
                @click="openCategory(cat.id)"
              >
                <v-list-item-icon class="my-0 mr-3">
                  <v-icon color="orange">mdi-folder</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="body-2">{{ cat.name }}</v-list-item-title>
              </v-list-item>
            <!-- </template> -->
            <!-- <v-list dense>
              <v-list-item
                v-for="(item, ind) in menu"
                :key="`menu_cat${ind}`"
                v-show="item.folder"
                @click="item.action"
              >
                <v-list-item-icon>
                  <v-icon :color="item.color">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> -->

          <v-divider v-if="categories.length"></v-divider>
          <!-- List of items -->
          <v-list-item
            @click="openItem(item.id)"
            v-for="(item, i) in items"
            :key="`item${i}`"
            :class="{ 'yellow': item.id === $route.params.itemId }"
          >
            <v-list-item-icon class="my-0 mr-3">
              <v-icon>mdi-file</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>

          <!-- Menu -->
          <v-menu
            open-on-hover
            close-on-click
            close-on-content-click
          >
            <template v-slot:activator="{ on }">
              <v-list-item v-on="on">
                <v-list-item-icon>
                  <v-icon color="light-gray">mdi-expand-all</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="caption">Добавить</v-list-item-title>
              </v-list-item>
            </template>
            <v-list dense>
              <v-list-item
                v-for="(item, ind) in menu"
                :key="`menu${ind}`"
                @click="item.action"
              >
                <v-list-item-icon>
                  <v-icon :color="item.color">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list>
      </v-flex>
      <v-flex xs8 v-show="itemOpened">
        <router-view />
      </v-flex>
    </v-layout>

  </div>
</template>

<script>
import api from '../../api';

const {
  getCategoryInfo,
  getBaseCategories,
  createCategory,
} = api;


export default {
  props: {
    categoryId: {
      type: [Number, String],
      required: false,
      default: 0,
    },
  },

  data: vm => ({
    category: {},
    baseCategory: true,
    categories: [],
    items: [],

    menu: [
      {
        name: 'Создать',
        icon: 'mdi-folder-plus',
        color: 'green',
        action: vm.createFolder,
        all: true,
        folder: true,
        file: false,
      },
      {
        name: 'Переименовать',
        icon: 'mdi-folder-settings-variant',
        color: 'primary',
        action: vm.renameFolder,
        all: false,
        folder: true,
        file: false,
      },
      {
        name: 'Удалить',
        icon: 'mdi-folder-remove',
        color: 'red',
        action: vm.removeFolder,
        all: false,
        folder: true,
        file: false,
      },
      {
        name: 'Создать',
        icon: 'mdi-file',
        color: 'gray',
        action: vm.createItem,
        all: false,
        folder: false,
        file: false,
      },
      // {
      //   name: 'Создать',
      // },
    ],

    newFolder: {},

    loading: true,
  }),

  computed: {
    showBackButton() {
      return this.category.parentId || !this.baseCategory;
    },

    itemOpened() {
      return this.$route.name.includes('item');
    },
  },

  beforeMount() {
    this.loadCategoryData();
  },

  watch: {
    categoryId(oldValue, newValue) {
      if (oldValue === newValue) {
        return;
      }

      this.loadCategoryData();
    },
  },

  methods: {
    createFolder() {
      this.newFolder = {
        name: '',
        parentId: this.$route.params.categoryId || null,
        edit: true,
      };
    },

    // createItem() {
    //   sh
    // },

    async saveNewCategory() {
      const name = this.newFolder.name.trim();

      if (!name) {
        return;
      }

      const newCategory = await createCategory(this.newFolder);

      this.categories.unshift(newCategory);
      this.newFolder = {};
    },

    async loadCategoryData() {
      this.loading = true;

      if (this.categoryId <= 0) {
        this.category = {};
        this.categories = await getBaseCategories();
        this.items = [];
        this.baseCategory = true;
      } else {
        this.category = await getCategoryInfo(this.categoryId);
        this.categories = this.category.categories;
        this.items = this.category.items;
        this.baseCategory = false;
      }

      this.loading = false;
    },

    goBack() {
      const params = { categoryId: this.category.parentId || 0 };
      this.$router.push({ name: 'categoryInfo', params });
    },

    openCategory(id) {
      if (id) {
        this.$router.push({ name: 'categoryInfo', params: { categoryId: id } });
      }
    },

    openItem(id) {
      if (this.$route.params.itemId === id) {
        return;
      }

      this.$router.push({ name: 'itemInfo', params: { itemId: id } });
    },
  },
};
</script>

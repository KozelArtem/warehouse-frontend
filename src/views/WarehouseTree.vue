<template>
  <v-container grid-list-sm>
    <v-layout row wrap>
      <v-flex xs12>
        <ItemModal
          :dialog="newItemModal"
          :category="selectedCategory"
          @close="newItemModal = false; selectedCategory = null"
          @submit="saveNewItem"/>
      </v-flex>
      <v-flex xs10 sm10 md7 lg7>
        <v-text-field
          v-model="search"
          @input="findItems()"
          prepend-icon="mdi-magnify"
          dense
          clearable
          max-width="300"
          hide-details
          class="d-flex mr-3"
        ></v-text-field>
      </v-flex>
      <v-flex hidden-sm-and-down md4 lg4>
        <!-- TODO Sort by Name (A-Z), Available, Out of stock -->
        <v-select
          :items="items"
          menu-props="auto"
          label="Сортировка"
          hide-details
          dense
          item-value="id"
          item-text="name"
          prepend-icon="mdi-sort"
          single-line
        ></v-select>
      </v-flex>
      <v-flex xs2 sm2 md1 lg1>
        <v-icon medium :color="!treeView ? 'red' : ''" @click="treeView = false; itemId = null">
          mdi-table-large
        </v-icon>
        <v-icon large :color="treeView ? 'red' : ''" @click="treeView = true">
          mdi-table-of-contents
        </v-icon>
      </v-flex>
      <v-flex
        :hidden-sm-and-down="itemId"
        :xs4="itemId"
        :xs12="!itemId" style="max-height: 82vh"
        class="overflow-y-auto"
      >
        <div v-if="search">
          <v-list
            subheader dense
            v-for="group in groupedSearchItems"
            :key="`group${group.name}`"
          >
            <span class="body-2">{{group.name}}</span>
            <v-list-item
              v-for="item in group.items"
              :key="item.id"
              dense
              @click="itemId = item.id"
            >
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
        <div v-else>
          <WarehouseTreeView
            v-if="treeView"
            :items="items"
            :menuItems="menuItems"
            :emitOpenCategory="fetchCategoryInfo"
            @selectItem="input => itemId = input"
            @newItem="showNewItemModal"
            @newCategory="newCategory"
            @renameCategory="renameCategory"
            @removeCategory="removeCategory"
          />
          <WarehouseCardView
            v-else
            :items="items"
            :menuItems="menuItems"
            :emitOpenCategory="fetchCategoryInfo"
            @selectItem="input => itemId = input"
            @newItem="showNewItemModal"
            @newCategory="newCategory"
            @renameCategory="renameCategory"
            @removeCategory="removeCategory"
          />
        </div>
        <v-progress-circular v-if="dataLoading" indeterminate color="primary" />
      </v-flex>
      <v-flex :hidden-sm-and-down="!itemId" :md8="itemId" :xs4="!itemId">
        <ItemDetails v-if="itemId" :itemId="itemId" @close="itemId = null" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '../api';
import constants from '../constants/data.json';

import {
  createItemKey,
  getIdFromKey,
  mapCategories,
  findItemInTree,
  createCategoryKey,
} from '../helpers/treeview';
import rules from '../helpers/validationRules';

import ItemDetails from '../components/item/ItemDetails.vue';
import ItemModal from '../components/item/ItemModal.vue';
import WarehouseTreeView from '../components/warehouse/WarehouseTreeView.vue';
import WarehouseCardView from '../components/warehouse/WarehouseCardView.vue';

const {
  getBaseCategories,
  getCategoryInfo,
  createCategory,
  updateCategory,
  removeCategory,
  searchItems,
} = api;

export default {
  components: {
    ItemDetails,
    ItemModal,
    WarehouseTreeView,
    WarehouseCardView,
  },
  // TODO Add switcher to show bages like in Yandex Disk
  data: vm => ({
    ...rules,
    ...constants,

    active: [],
    open: [],
    tree: [],
    items: [],
    menu: {},

    treeView: true,

    newItemModal: false,
    selectedCategory: null,

    menuItems: [
      {
        name: 'Добавить элемент',
        condition: () => true,
        func: vm.showNewItemModal,
      },
      {
        name: 'Создать',
        condition: () => true,
        func: vm.newCategory,
      },
      {
        name: 'Переименовать',
        condition: () => true,
        func: vm.renameCategory,
      },
      {
        name: 'Удалить',
        condition: item => item.fetch && !item.children.length,
        func: vm.removeCategory,
      },
    ],

    searching: false,
    search: null,
    itemId: null,
    searchedItems: [],

    dataLoading: false,
  }),

  async beforeMount() {
    this.dataLoading = true;

    const data = await getBaseCategories();

    this.dataLoading = false;
    this.items = mapCategories(data);
  },

  computed: {
    groupedSearchItems() {
      return this.searchedItems.reduce((acc, cur) => {
        const catName = cur.categoryName;
        const group = acc[catName] || { name: catName, items: [] };

        group.items.push(cur);
        acc[catName] = group;

        return acc;
      }, {});
    },
  },

  methods: {
    async fetchCategoryInfo(category) {
      const categoryCopy = category;
      const categoryId = getIdFromKey(categoryCopy.id);
      const { items, categories } = await getCategoryInfo(categoryId);
      categoryCopy.fetch = true;
      categoryCopy.children = [
        ...mapCategories(categories),
        ...items.map(item => ({ ...item, id: createItemKey(item.id) })),
      ];
    },

    async openCategory(category) {
      if (!category.fetch) {
        await this.fetchCategoryInfo(category);
      }

      this.open.push(category.id);
    },

    openMenu(itemId) {
      this.menu = { [itemId]: true };
    },

    async newCategory(baseCategory) {
      if (baseCategory.id.split('_').includes('new')) {
        if (!baseCategory.name.trim()) {
          return;
        }

        const data = {
          parentId: getIdFromKey(baseCategory.parent.id),
          name: baseCategory.name,
        };
        const category = await createCategory(data);

        baseCategory.parent.children.shift();
        baseCategory.parent.children.unshift(...mapCategories([category]));

        return;
      }

      await this.openCategory(baseCategory);

      const haveActiveAdd = !!baseCategory.children
        .filter(item => item.id === `new_${baseCategory.id}`)
        .length;

      if (haveActiveAdd) {
        baseCategory.children.shift();
        return;
      }

      baseCategory.children.unshift(({
        id: `new_${baseCategory.id}`,
        edit: true,
        parent: baseCategory,
        children: [],
      }));
    },

    async renameCategory(category) {
      // eslint-disable-next-line no-restricted-globals
      const result = prompt(`Предыдущее название ${category.name}`);

      if (result && result.trim()) {
        const categoryId = getIdFromKey(category.id);
        const response = await updateCategory(categoryId, { name: result });

        const a = category;
        a.name = response.name;
      }
    },

    async removeCategory(category) {
      // eslint-disable-next-line no-restricted-globals
      const result = confirm(`Вы действительно хотите удалить ${category.name}?`);

      if (result) {
        const categoryId = getIdFromKey(category.id);
        const parent = findItemInTree(this.items, createCategoryKey(category.parentId));
        const success = await removeCategory(categoryId);

        if (success) {
          if (!parent) {
            this.items.filter(item => item.id === category.id);
          } else {
            parent.children = parent.children.filter(child => child.id !== category.id);
          }
        }
      }
    },

    showNewItemModal(baseCategory) {
      this.selectedCategory = { ...baseCategory, id: +getIdFromKey(baseCategory.id) };
      this.newItemModal = true;
    },

    async saveNewItem(item, newItem = true) {
      if (newItem) {
        this.selectedCategory.id = createCategoryKey(this.selectedCategory.id);

        await this.fetchCategoryInfo({ ...this.selectedCategory });
        this.selectedCategory = null;
        this.newItemModal = false;

        return;
      }

      if (item.children) {
        this.newItemModal = true;
        this.selectedCategory = { ...item, id: +getIdFromKey(item.id) };
      }
    },

    async findItems() {
      if ((this.search || '').trim()) {
        this.searchedItems = await searchItems(this.search);
      }
    },
  },
};
</script>

<style lang="scss">
.v-treeview--dense .v-treeview-node__root,
.v-list-item--dense, .v-list--dense .v-list-item {
  min-height: 20px !important;
}
</style>

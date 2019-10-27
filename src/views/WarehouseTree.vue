<template>
  <v-container grid-list-sm>
    <v-layout row wrap>
      <v-flex xs12 v-if="modal">
        <NewItemModal
          :dialog="modal"
          :category="selectedCategory"
          @close="modal = false; selectedCategory = null"
          @save="onNewItemClick"/>
      </v-flex>
      <v-flex :xs4="itemView" :xs8="!itemView" style="height: 80vh">
        <v-treeview
          v-model="tree"
          :open="open"
          :items="items"
          :active.sync="active"
          activatable
          item-key="id"
          open-on-click
          dense
          :load-children="fetchInfo"
        >
          <template v-slot:label="{ item }">
            <v-text-field v-if="item.edit"
              label="Название категории"
              v-model="item.name"
            ></v-text-field>

            <span @contextmenu.prevent="onNewItemClick(item, false)">{{ item.name }}</span>
          </template>

          <template v-slot:prepend="{ item, open }">
            <v-menu v-model="menu[item.id]" offset-y>
              <template v-slot:activator="{ on }">
                <v-icon v-if="item.children"
                  :color="item.edit ? 'gray' : 'blue'"
                  @contextmenu.prevent="context(item)"
                  @click.stop="newCategory(item)">
                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
              </template>
              <v-btn small @click="onRenameClick(item)">Переименовать</v-btn>
              <v-btn
                small
                v-if="item.fetch && !item.children.length"
                @click="onRemoveClick(item)"
              >Удалить</v-btn>
            </v-menu>
          </template>
        </v-treeview>
      </v-flex>
      <v-flex :xs8="itemView" :xs4="!itemView">
        <ItemDetails v-if="selectedId" :itemId="selectedId" @close="active = []" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '../api';

import {
  createItemKey,
  getIdFromKey,
  mapCategories,
  findItemInTree,
  createCategoryKey,
} from '../helpers/treeview';

import ItemDetails from '../components/item/ItemDetails.vue';
import NewItemModal from '../components/item/NewItemModal.vue';

const {
  getBaseCategories,
  getCategoryInfo,
  createCategory,
  updateCategory,
  removeCategory,
} = api;

export default {
  components: {
    ItemDetails,
    NewItemModal,
  },

  data: () => ({
    active: [],
    open: [],
    tree: [],
    items: [],
    itemView: false,
    menu: {},

    modal: true,
    selectedCategory: null,
  }),

  async beforeMount() {
    const data = await getBaseCategories();

    this.items = mapCategories(data);
  },

  computed: {
    selectedId() {
      const key = (this.active || [])[0];

      return key ? getIdFromKey(key) : null;
    },
  },

  watch: {
    active() {
      this.itemView = !!this.active.length;
    },
  },

  methods: {
    async fetchInfo(category) {
      const categoryCopy = category;
      const categoryId = getIdFromKey(category.id);
      const { items, categories } = await getCategoryInfo(categoryId);

      categoryCopy.fetch = true;
      categoryCopy.children = [
        ...mapCategories(categories),
        ...items.map(item => ({ ...item, id: createItemKey(item.id) })),
      ];
    },

    async newCategory(baseCategory) {
      if (baseCategory.id.split('_').includes('new')) {
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

    closeNewCategoryMode(baseCategory) {
      baseCategory.parent.children.shift();
    },

    async context(category) {
      this.menu = { [category.id]: true };
    },

    async openCategory(category) {
      console.log(category.id, this.open);

      if (!category.fetch) {
        await this.fetchInfo(category);
        this.open.push(category.id);
      }
    },

    async onRenameClick(category) {
      // eslint-disable-next-line no-restricted-globals
      const result = prompt(`message ${category.name}`);

      if (result.trim()) {
        const categoryId = getIdFromKey(category.id);
        const response = await updateCategory(categoryId, { name: result });

        const a = category;
        a.name = response.name;
      }
    },

    async onRemoveClick(category) {
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

    onNewItemClick(item, newItem = true) {
      if (newItem) {
        this.selectedCategory.children.unshift(item);
        this.selectedCategory = null;
        this.modal = false;

        return;
      }
      if (item.children) {
        this.modal = true;
        this.selectedCategory = { ...item, id: getIdFromKey(item.id) };
      }
    },
  },
};
</script>

<style lang="scss">
.v-treeview--dense .v-treeview-node__root {
  min-height: 20px !important;
}
</style>

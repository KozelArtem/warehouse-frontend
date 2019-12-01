<template>
<v-container grid-list-md>
  <v-layout row wrap>
    <v-flex xs12>
      <v-dialog
        v-model="itemView"
        scrollable fullscreen
        persistent :overlay="false"
        max-width="500px"
        transition="dialog-transition"
      >
        <ItemDetails :itemId="itemId" @close="itemId = -1; itemView = false" />
      </v-dialog>
    </v-flex>
    <v-flex xs2 v-if="(baseCategory || {}).id">
      <v-card
        height="120"
        flat hover
        class="text-center"
        @click="goBack()"
      >
        <v-icon size="40" color="yellow darken-2" style="margin: 23%">
          mdi-arrow-left-bold-outline
        </v-icon>
      </v-card>
    </v-flex>
    <v-flex xs2 v-for="item in localItems" :key="item.id">
      <v-card height="120" flat hover @click="openCategory(item)" class="text-center">
        <v-img
          v-if="!item.children"
          :src="item.imagePath || baseImage"
          height="80"
          contain
        >
        </v-img>
        <v-icon v-else size="80" color="yellow darken-2">mdi-folder</v-icon>
        <v-card-title class="align-center pt-2 subtitle-2" style="line-height: 14px;">
         <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div class="flex subtitle-2 text-truncate text-center" v-on="on">
                {{ item.name }}
            </div>
          </template>
          <span>{{ item.name }}</span>
        </v-tooltip>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import rules from '../../helpers/validationRules';

import {
  createCategoryKey,
  getIdFromKey,
  findItemInTree,
} from '../../helpers/treeview';

import ItemDetails from '../item/ItemDetails.vue';

export default {
  components: {
    ItemDetails,
  },

  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    menuItems: {
      type: Array,
      default: () => [],
    },
    emitOpenCategory: {
      type: Function,
      required: true,
    },
  },

  data: () => ({
    ...rules,
    show: false,
    active: [],
    open: [],
    tree: [],
    localItems: [],
    itemId: null,
    itemView: false,
    menu: {},
    baseCategory: null,
    baseImage: 'http://www.satinalmadergisi.com/wp-content/uploads/2016/12/no_images-150x150.png',
  }),

  beforeMount() {
    this.localItems = this.items;
  },

  watch: {
    items() {
      this.localItems = this.items;
    },
  },

  methods: {
    goBack() {
      const baseCategory = this.baseCategory || {};
      const parentId = createCategoryKey(baseCategory.parentId);
      if (parentId) {
        const finded = findItemInTree(this.items, parentId);
        this.localItems = (finded || {}).children || this.items;
        this.baseCategory = finded;
      } else {
        this.localItems = this.items;
        this.baseCategory = null;
      }
    },

    openMenu(itemId) {
      this.menu = { [itemId]: true };
    },

    async openCategory(category) {
      if (!category.children) {
        this.itemId = getIdFromKey(category.id);
        this.itemView = true;

        return;
      }

      await this.emitOpenCategory(category);
      this.baseCategory = category;
      this.localItems = category.children;
    },

    onNewCategoryTFKeyPress(key, newCategory) {
      if (key.code === 'Enter') {
        key.preventDefault();

        this.newCategory(newCategory);
      }
    },

    showNewItemModal(baseCategory) {
      this.$emit('newItem', baseCategory);
    },

    newCategory(baseCategory) {
      this.$emit('newCategory', baseCategory);
    },

    renameCategory(baseCategory) {
      this.$emit('renameCategory', baseCategory);
    },
    removeCategory(baseCategory) {
      this.$emit('removeCategory', baseCategory);
    },
  },
};
</script>

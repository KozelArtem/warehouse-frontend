<template>
  <v-treeview
    v-model="tree"
    :open="open"
    :items="items"
    :active.sync="active"
    activatable
    item-key="id"
    open-on-click
    dense
    expand-icon
    :load-children="openCategory"
  >
    <template v-slot:label="{ item }">
      <v-text-field
        v-if="item.edit"
        label="Название категории"
        :rules="[required]"
        v-model="item.name"
        @keypress="key => onNewCategoryTFKeyPress(key, item)"
      ></v-text-field>

      <v-menu v-model="menu[item.id]" v-else offset-y>
        <template v-slot:activator="{ on }">
          <span
            :class="item.amount === 0 ? 'red lighten-1 white--text' : ''"
            @contextmenu.prevent="openMenu(item.id)"
          >{{ item.name }}</span>
        </template>
        <v-layout column class="white">
          <v-btn
            v-show="menuItem.condition(item)"
            @click="menuItem.func(item)"
            v-for="(menuItem, i) in menuItems"
            :key="`mI${i}`"
            xSmall
            outlined
            text
          >{{ menuItem.name }}</v-btn>
        </v-layout>
      </v-menu>
    </template>

    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="item.children" color="deep-orange">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
    </template>
  </v-treeview>
</template>

<script>
import rules from '../../helpers/validationRules';

import {
  getIdFromKey,
} from '../../helpers/treeview';

export default {
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

    active: [],
    open: [],
    tree: [],
    itemView: false,
    menu: {},
  }),

  watch: {
    active() {
      this.itemView = !!this.active.length;

      this.$emit('selectItem', this.getSelectedId());
    },
  },

  methods: {
    getSelectedId() {
      const key = (this.active || [])[0];

      return key ? getIdFromKey(key) : null;
    },

    openMenu(itemId) {
      this.menu = { [itemId]: true };
    },

    async openCategory(category) {
      await this.emitOpenCategory(category);
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

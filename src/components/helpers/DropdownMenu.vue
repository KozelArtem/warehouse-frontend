<template>
  <v-menu bottom>
    <template v-slot:activator="{ on }">
      <v-btn small icon v-on="on">
        <v-icon :color="color">{{ icon }}</v-icon>
      </v-btn>
    </template>

    <v-list dense>
      <v-list-item
        dense
        v-for="(item, i) in localItems"
        :key="i"
        @click="$emit(item.event)"
      >
        <v-list-item-icon>
          <v-icon :color="item.color" v-text="item.icon"></v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: false,
      default: 'mdi-dots-horizontal',
    },
    color: {
      type: String,
      required: false,
      default: 'white',
    },
    fields: {
      type: Array,
      required: false,
      default: () => ['update', 'remove'],
    },
  },

  data: () => ({
    items: [
      {
        title: 'Добавить',
        event: 'create',
        color: 'green',
        icon: 'mdi-plus',
      },
      {
        title: 'Новая категория',
        event: 'newFolder',
        color: 'green',
        icon: 'mdi-folder-plus',
      },
      {
        title: 'Редактировать',
        event: 'update',
        color: 'primary',
        icon: 'mdi-pencil',
      },
      {
        title: 'Удалить',
        event: 'remove',
        color: 'red',
        icon: 'mdi-delete',
      },
    ],

  }),

  computed: {
    localItems() {
      return this.items.slice(0).filter(i => this.fields.includes(i.event));
    },
  },
};
</script>

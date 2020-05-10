<template>
  <v-menu bottom>
    <template v-slot:activator="{ on }">
      <v-btn small icon v-on="on">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>

    <v-list dense>
      <v-list-item
        dense
        v-for="(item, i) in items"
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
  },

  data: () => ({
    items: [
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
};
</script>

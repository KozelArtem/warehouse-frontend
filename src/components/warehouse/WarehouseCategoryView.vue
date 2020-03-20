<template>
  <v-list>
    <v-list-item v-if="!rootCategory.id">
      <v-list-icon>mdi-arrow-up-bold</v-list-icon>
      <v-list-title>Назад к {{ rootCategory.name }}</v-list-title>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    categories: {
      type: Array,
      required: true,
      default: () => [],
    },
    rootCategory: {
      type: Object,
      required: false,
      default: () => {},
    },
  },

  data: () => ({

  }),
};
</script>

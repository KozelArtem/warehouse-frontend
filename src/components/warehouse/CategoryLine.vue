<template>
  <v-list-item @click="open()">
    <v-list-item-avatar>
      <v-icon>mdi-folder</v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ value.name }}</v-list-item-title>
    </v-list-item-content>

    <v-list-item-action>
      <DropdownMenu />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      requred: true,
      default: () => {},
    },
  },

  components: {
    DropdownMenu: () => import('../helpers/DropdownMenu.vue'),
  },

  methods: {
    open() {
      this.$emit('click', this.value.id);
    },
  },
};
</script>

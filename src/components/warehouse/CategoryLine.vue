<template>
  <div>
    <v-list-item @click="open()" style="min-height: 20px">
      <v-list-item-avatar class="my-0" size="20" tile>
        <v-icon color="yellow darken-3">mdi-folder</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ value.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
  </div>
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

  methods: {
    open() {
      this.$emit('click', this.value.id);
    },
  },
};
</script>

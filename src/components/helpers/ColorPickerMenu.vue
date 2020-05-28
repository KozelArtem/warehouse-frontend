<template>
  <div>
    <v-menu bottom :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-btn small icon v-on="on">
          <v-icon>mdi-palette</v-icon>
        </v-btn>
      </template>

      <v-color-picker
        v-model="color"
        @input="$emit('input', color)"
        hide-mode-switch
      />
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    },
  },
  data: () => ({
    color: '#D9B08C',
    search: null,
  }),
  watch: {
    value() {
      this.color = this.value;
    },
  },
};
</script>

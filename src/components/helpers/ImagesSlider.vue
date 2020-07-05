<template>
  <div>
    <v-dialog
      :value="true"
      transition="dialog-transition"
      fullscreen
    >
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-icon @click="$emit('close')">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <v-carousel hide-delimiters height="93vh">
            <v-carousel-item
              v-for="(item, i) in images"
              :key="i"
              :src="item.url"
              contain
            ></v-carousel-item>
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
};
</script>

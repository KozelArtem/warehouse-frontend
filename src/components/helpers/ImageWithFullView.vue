<template>
  <v-img
    :src="imagePath"
    :lazy-src="defaultImage"
    style="cursor: pointer;"
    @click="openFull()"
    @error="onError"
    @loaded="error = false"
  >
    <v-dialog
      v-model="dialog"
      scrollable
      :overlay="false"
      max-width="70vw"
      transition="dialog-transition"
    >
      <v-card>
        <v-img
          style="cursor: pointer"
          :src="src"
          @click="$emit('close')"
        ></v-img>
      </v-card>
    </v-dialog>
  </v-img>
</template>

<script>
import defaultImgMin from '../../assets/no-image-min.png';

export default {
  props: {
    src: {
      type: String,
      required: true,
      default: '',
    },
  },

  data: vm => ({
    dialog: false,
    imagePath: vm.src,
    error: true,
  }),

  computed: {
    defaultImage() {
      return defaultImgMin;
    },
  },

  watch: {
    src() {
      this.imagePath = this.src;
    },
  },

  methods: {
    openFull() {
      if (!(this.src && this.error)) {
        return;
      }

      this.dialog = true;
    },

    onError() {
      this.error = true;
      this.imagePath = this.defaultImage;
    },
  },
};
</script>

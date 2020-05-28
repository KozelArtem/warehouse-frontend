<template>
  <div>
    <v-toolbar :color="color">
      <ColorPickerMenu v-model="color" />
      <slot name="title">
        <v-toolbar-title class="font-weight-black headline" style="color: #2C3531">
          {{ title }}
        </v-toolbar-title>
      </slot>
      <v-divider class="mx-4" inset vertical></v-divider>
      <slot name="afterTitle"></slot>
      <v-spacer></v-spacer>
      <slot name="right" v-if="showSearch">
        <span :class="['d-flex', {
          'w-200': $vuetify.breakpoint.smAndUp,
          'w-100': $vuetify.breakpoint.xs,
          }
        ]">
          <v-text-field
            v-model="search"
            label="Поиск"
            dense
            hide-details
            append-icon="mdi-magnify"
          />
        </span>
      </slot>
    </v-toolbar>
    <v-divider></v-divider>
    <v-progress-linear
      :active="loading"
      indeterminate
      color="#D9B08C"
      height="7px"
      opacity="0.3"
    ></v-progress-linear>
  </div>
</template>

<script>
export default {
  components: {
    ColorPickerMenu: () => import('./ColorPickerMenu.vue'),
  },
  props: {
    title: {
      type: String,
      required: true,
      default: '',
    },
    loading: {
      type: Boolean,
      required: true,
      default: true,
    },
    showSearch: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data: () => ({
    color: '#D9B08C',
    search: null,
  }),
  watch: {
    search() {
      this.$emit('search', this.search);
    },
  },
};
</script>

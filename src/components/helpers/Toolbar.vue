<template>
  <div>
    <v-toolbar flat color="primary" dark>
      <slot name="title">
        <v-toolbar-title class="font-weight-black headline">
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
    <v-divider class="black"></v-divider>
    <v-progress-linear
      :active="loading"
      indeterminate
      color="rgba(189, 189, 189, 0.4)"
      height="7px"
      opacity="0.3"
    ></v-progress-linear>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
      default: '',
    },
    color: {
      type: String,
      required: false,
      default: 'white',
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
    search: null,
  }),
  watch: {
    search() {
      this.$emit('search', this.search);
    },
  },
};
</script>

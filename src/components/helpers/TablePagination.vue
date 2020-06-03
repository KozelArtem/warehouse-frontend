<template>
  <tfoot>
    <tr>
      <td :colspan="headersLength">
        <v-row no-gutters align="center">
          <v-col cols="10">
            <v-pagination
              bottom
              v-model="page"
              :length="totalPages"
              :total-visible="7"
            ></v-pagination>
          </v-col>
          <v-col cols="2">
            <v-select
              class="ma-2"
              v-model="limit"
              :items="limits"
              menu-props="auto"
              hide-details
              label="Элементов на страницe"
            ></v-select>
          </v-col>
        </v-row>
      </td>
      <slot name="right"></slot>
    </tr>
  </tfoot>
</template>

<script>
export default {
  props: {
    headersLength: {
      type: Number,
      required: true,
      default: 2,
    },
    totalPages: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  data: () => ({
    page: 1,
    limits: [
      { text: 3, value: 3 },
      { text: 5, value: 5 },
      { text: 10, value: 10 },
      { text: 20, value: 20 },
      { text: 50, value: 50 },
      { text: 100, value: 100 },
    ],
    limit: 10,
  }),

  computed: {
    emitData() {
      return {
        limit: this.limit,
        page: this.page,
        offset: this.limit * (this.page - 1),
      };
    },
  },

  watch: {
    limit() {
      this.$emit('change', this.emitData);
    },
    totalPages() {
      this.page = 1;
    },
    page() {
      this.$emit('change', this.emitData);
    },
  },
};
</script>

<template>
  <v-list-item @click="open()">
    <v-list-item-avatar>
      <v-icon>mdi-file</v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ value.name }}</v-list-item-title>
    </v-list-item-content>

    <v-list-item-action>
      <span
        class="font-weight-bold"
        :class="{
          'green--text': value.amount >= 10,
          'orange--text': value.amount < 10 && value.amount > 0,
          'red--text': value.amount < 1,
        }"
      >
        {{ value.amount }}
      </span>
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

  methods: {
    open() {
      this.$emit('click', this.value.id);
    },
  },
};
</script>

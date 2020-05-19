<template>
  <div>
    <v-list-item @click="open()" style="min-height: 20px">
      <v-list-item-avatar class="my-0" size="20" tile>
        <v-icon>mdi-menu-right</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ value.name }}</v-list-item-title>
      </v-list-item-content>

      <v-list-item-action class="my-0">
        <span
          class="font-weight-bold"
          :class="{
            'green--text': value.amount > 0,
            'red--text': value.amount < 1,
          }"
        >
          {{ value.amount }}
        </span>
      </v-list-item-action>
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

<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>{{ description }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text small dark
            @click="$emit('click', true)"
          >
            {{ acceptText }}
          </v-btn>
          <v-btn color="green" text small dark
            @click="$emit('click', false)"
          >
            {{ declineText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    title: {
      type: String,
      required: true,
      default: '',
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
    acceptText: {
      type: String,
      required: false,
      default: 'Подтвердить',
    },
    declineText: {
      type: String,
      required: false,
      default: 'Отменить',
    },
  },
};
</script>

<template>
  <v-layout row justify-center>
    <v-dialog :value="true" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text class="subtitle-1">{{ description }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined small dark
            @click="$emit('click', false)"
          >
            {{ declineText }}
          </v-btn>
          <v-btn color="green" outlined small dark
            @click="$emit('click', true)"
          >
            {{ acceptText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  props: {
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
      default: 'Удалить',
    },
    declineText: {
      type: String,
      required: false,
      default: 'Отмена',
    },
  },
};
</script>

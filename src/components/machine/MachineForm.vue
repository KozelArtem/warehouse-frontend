<template>
  <v-dialog
    v-model="dialog"
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="orange lighten-2">
        <span class="headline">Добавление нового оборудования</span>
        <v-spacer></v-spacer>
        <v-icon color="red" @click="onClose()">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field v-model="machine.name" required />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn outlined color="green" :disabled="!valid" @click="createMachine()">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data: () => ({
    machine: {
      name: '',
    },
    valid: false,
  }),

  methods: {
    async createMachine() {
      if (!this.machine.name.trim()) {
        return;
      }

      this.$emit('submit', this.machine);
    },

    onClose() {
      this.machine = { name: '' };
      this.$emit('close');
    },
  },
};
</script>

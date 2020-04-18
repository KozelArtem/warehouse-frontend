<template>
   <v-dialog
    :value="true"
    persistent :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title primary-title>
        {{ title }}
        <v-spacer />
        <v-icon @click="close()">mdi-close</v-icon>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-form v-model="valid">
          <v-text-field label="Название" v-model="task.name" required></v-text-field>
          <DatePicker label="Дата добавления" v-model="task.addedAt" />
          <v-spacer class="pb-4"></v-spacer>
          <DatePicker label="Дата выполнения" v-model="task.completedAt" />
          <v-switch v-model="task.isTO" label="TO" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="saveTask()" text>Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

import { MACHINE_NAMESPACE } from '../../store/namespaces';

export default {
  components: {
    DatePicker: () => import('../helpers/DatePicker.vue'),
  },
  props: {
    machineId: {
      type: [Number, String],
      required: true,
      default: 0,
    },
    title: {
      type: String,
      required: true,
      default: '',
    },
    data: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data: () => ({
    valid: false,
    task: {
      name: '',
      isTO: false,
      addedAt: null,
      completedAt: null,
    },
  }),

  beforeMount() {
    this.task = { ...this.task, ...this.data };
  },

  methods: {
    ...mapActions(MACHINE_NAMESPACE, ['createMachineService', 'updateMachineService']),

    close() {
      this.$emit('close');
    },
    saveTask() {
      const data = {
        machineId: this.machineId,
        ...this.task,
      };
      if (this.task.id) {
        this.updateMachineService(data);
      } else {
        this.createMachineService(data);
      }

      this.$emit('submit', this.task);
    },
  },
};
</script>

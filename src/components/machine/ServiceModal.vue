<template>
   <v-dialog
    :value="true"
    persistent
    :overlay="false"
    max-width="800px"
    transition="dialog-transition"
  >
    <v-card shaped>
      <v-card-title primary-title class="grey lighten-2">
        {{ title }}
        <v-spacer />
        <v-icon @click="close()">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-sm>
          <v-layout row wrap>
            <v-flex xs11>
              <v-text-field label="Название" v-model="task.name" />
            </v-flex>
            <v-flex xs1>
              <v-switch v-model="task.isTO" label="TO" />
            </v-flex>
            <v-flex xs12>
              <v-textarea
                dense
                label="Описание"
                rows="2"
                v-model="task.description"
                />
            </v-flex>
            <v-flex xs6>
              <v-textarea
                dense
                label="Диагостика"
                rows="2"
                v-model="task.diagnostic"
              />
            </v-flex>
            <v-flex xs6>
              <v-textarea
                dense
                label="Устранение(выполнение)"
                rows="2"
                v-model="task.elimination"
              />
            </v-flex>
            <v-flex xs12>
              <v-select
                dense
                label="Выполнил"
                :items="workers"
                v-model="task.doneWorkerId"
                autocomplete
                clearable
              ></v-select>
            </v-flex>
            <v-flex xs6>
              <DatePicker label="Дата добавления" v-model="task.addedAt" />
            </v-flex>
            <v-flex xs6>
              <DatePicker label="Дата выполнения" v-model="task.completedAt" />
            </v-flex>
            <v-flex xs12 class="mt-5">
              <v-btn
                v-if="data"
                small
                dark
                color="red"
                @click="removeTask()"
              >
                Удалить
              </v-btn>
              <v-btn
                class="float-right"
                small
                :dark="isValid"
                color="green"
                :disabled="!isValid"
                @click="saveTask()"
              >
                Сохранить
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import translate from '../../helpers/translate';
import { MACHINE_NAMESPACE, WORKER_NAMESPACE } from '../../store/namespaces';

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
      description: '',
      diagnostic: '',
      elimination: '',
      doneWorkerId: null,
    },
  }),

  beforeMount() {
    this.task = { ...this.task, ...this.data };
    this.fetchWorkers({ position: 'mechanic' });
  },

  computed: {
    ...mapGetters(WORKER_NAMESPACE, ['workerList']),

    workers() {
      return this.workerList.map(i => ({
        value: i.id,
        text: `${i.surname} ${i.name} - ${translate(i.position)}`,
      }));
    },

    isValid() {
      const {
        name,
        addedAt,
      } = this.task;

      if (name.trim().length < 2) {
        return false;
      }
      if (!addedAt) {
        return false;
      }

      return true;
    },
  },

  methods: {
    ...mapActions(MACHINE_NAMESPACE, [
      'createMachineService',
      'updateMachineService',
      'removeMachineService',
    ]),
    ...mapActions(WORKER_NAMESPACE, ['fetchWorkers']),

    close() {
      this.$emit('close');
    },
    removeTask() {
      const data = {
        machineId: this.machineId,
        id: this.task.id,
      };
      this.removeMachineService(data);

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

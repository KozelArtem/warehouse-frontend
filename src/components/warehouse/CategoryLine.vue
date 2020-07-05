<template>
  <div>
    <v-list-item @click="open()" style="min-height: 20px;">
      <v-list-item-avatar class="my-0" size="20" tile>
        <v-icon color="primary">mdi-folder</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title v-if="rename">
          <v-text-field
            v-model="name"
            dense
            placeholder="Новое название категории"
            hide-details
          ></v-text-field>
        </v-list-item-title>
        <v-list-item-title v-else>{{ value.name }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action class="my-0" v-if="isAdmin">
        <div v-if="rename">
          <v-icon @click.stop="rename = false" color="red">mdi-close</v-icon>
          <v-icon @click.stop="onSave()" :disabled="!isValid" color="green">mdi-check</v-icon>
        </div>
        <v-icon small v-else @click.stop="rename = true">mdi-pencil</v-icon>
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { AUTH_NAMESPACE } from '../../store/namespaces';

export default {
  props: {
    value: {
      type: Object,
      requred: true,
      default: () => {},
    },
  },

  data: vm => ({
    rename: false,
    name: vm.value.name,
  }),

  computed: {
    ...mapGetters(AUTH_NAMESPACE, ['isAdmin']),

    isValid() {
      return this.name.length > 2;
    },
  },

  methods: {
    open() {
      if (this.rename) {
        return;
      }

      this.$emit('click', this.value.id);
    },

    onSave() {
      this.rename = false;
      this.$emit('rename', { id: this.value.id, name: this.name });
    },
  },
};
</script>

<template>
  <div>
    <v-dialog :value="true" persistent max-width="600px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Новая категория</span>
          <v-spacer></v-spacer>
          <v-icon color="red" @click="$emit('close')">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
         <v-text-field
           label="Название"
           v-model="name"
         ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="green"
            :dark="isValid"
            :loading="isLoading"
            :disabled="!isValid"
            @click="onSaveClick()"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { CATEGORY_NAMESPACE } from '../../store/namespaces';

export default {
  props: {
    categoryId: {
      type: [Number, String],
      required: false,
      default: null,
    },
  },
  data: () => ({
    name: '',
  }),

  computed: {
    ...mapGetters(CATEGORY_NAMESPACE, ['isLoading']),

    isValid() {
      if (this.name.length > 2) {
        return true;
      }

      return false;
    },
  },

  methods: {
    ...mapActions(CATEGORY_NAMESPACE, ['createCategory', 'fetchCategoryInfo']),

    async onSaveClick() {
      const data = {
        name: this.name,
        parentId: this.categoryId,
      };

      await this.createCategory(data);
      this.fetchCategoryInfo(this.categoryId);
      this.$emit('close');
    },
  },
};
</script>

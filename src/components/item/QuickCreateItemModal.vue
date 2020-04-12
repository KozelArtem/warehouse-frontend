<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="purple white--text darken-3">
        <span class="headline"></span>
        <v-spacer></v-spacer>
        <v-icon color="red" @click="$emit('close')">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-container grid-list-md>
            <v-layout column wrap>
              <v-flex>
                <AutocompleteWithAdd
                  label="Категория"
                  :items="categoryList"
                  :loading="categoriesLoading"
                  :slotButtonDisabled="creatingCategory"
                  :selectedItemId="item.categoryId || -1"
                  @slotButtonClick="showCompanyDialog = true"
                  @change="categoryId => item.categoryId = categoryId"
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="item.name"
                  label="Наименование"
                  dense
                  :rules="[required, minLength]"
                  hide-details
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="green"
          :dark="valid"
          :loading="loading"
          :disabled="!valid"
          @click="onSaveClick()"
        >Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import api from '../../api';

import rules from '../../helpers/validationRules';

import AutocompleteWithAdd from '../helpers/AutocompleteWithAdd.vue';
import { ITEM_NAMESPACE, CATEGORY_NAMESPACE } from '../../store/namespaces';

const {
  createCategory,
} = api;

export default {
  components: {
    AutocompleteWithAdd,
  },

  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    name: {
      type: String,
      required: false,
      default: '',
    },
  },

  data: () => ({
    ...rules,

    loading: false,
    valid: false,
    item: {},
    itemTemplate: {
      categoryId: 0,
      name: '',
    },

    search: null,
    creatingCategory: false,

    categoriesLoading: false,
  }),

  async beforeMount() {
    this.item = this.itemTemplate;
    this.fetchCategories();
  },

  computed: {
    ...mapGetters(ITEM_NAMESPACE, ['itemList']),
    ...mapGetters(CATEGORY_NAMESPACE, ['categoryList']),
  },

  watch: {
    name() {
      this.item = { ...this.itemTemplate, name: this.name };
    },
  },

  methods: {
    ...mapActions(ITEM_NAMESPACE, ['createItem']),
    ...mapActions(CATEGORY_NAMESPACE, ['createCategory', 'fetchCategories']),
    async onSaveClick() {
      const data = { ...this.item, amount: 0 };

      const result = await this.createItem(data);

      result.categoryName = this.categories
        .find(category => category.id === result.categoryId)
        .name;

      this.item = { ...this.itemTemplate };
      this.$emit('submit', result);
    },

    async createCategory(inputedName) {
      if (!inputedName) {
        return;
      }

      this.creatingCategory = true;

      const data = await createCategory({ name: inputedName });

      if (data) {
        this.categories.push(data);
        this.item.categoryId = data.id;
      }

      this.creatingCategory = false;
    },
  },
};
</script>

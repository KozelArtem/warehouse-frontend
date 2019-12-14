<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="purple white--text darken-3">
        <span class="headline"></span>
        <v-spacer></v-spacer>
        <v-icon color="red" @click="$emit('close')">{{icons.close}}</v-icon>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-container grid-list-md>
            <v-layout column wrap>
              <v-flex>
                <AutocompleteWithAdd
                  label="Категория"
                  :items="categories"
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
import api from '../../api';
import constants from '../../constants/data.json';

import rules from '../../helpers/validationRules';

import AutocompleteWithAdd from '../helpers/AutocompleteWithAdd.vue';

const {
  createItem,
  createCategory,
  getShortCategoryList,
} = api;

const {
  icons,
} = constants;

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
    icons,
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
    categories: [],
  }),

  async beforeMount() {
    this.item = this.itemTemplate;
    await this.loadCategoriesList();
  },

  watch: {
    name() {
      this.item.name = this.name;
    },
  },

  methods: {
    async onSaveClick() {
      const data = { ...this.item, amount: 0 };

      this.loading = true;

      const result = await createItem(data);

      this.loading = false;

      if (!result.id) {
        // TODO add handler
        return;
      }

      result.categoryName = this.categories
        .find(category => category.id === result.categoryId)
        .name;

      this.item = this.itemTemplate;
      this.$emit('submit', result);
    },

    async loadCategoriesList() {
      this.categoriesLoading = false;
      this.categories = await getShortCategoryList();
      this.categoriesLoading = false;
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

<template>
  <v-dialog :value="true" persistent max-width="600px">
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
                  v-model="item.categoryId"
                  label="Категория"
                  :items="categoryList"
                  :loading="categoriesLoading"
                  :slotButtonDisabled="creatingCategory"
                  @slotButtonClick="showCompanyDialog = true"
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="item.name"
                  label="Наименование"
                  dense
                  :rules="[required, minLength]"
                  :hint="itemsExistTitle"
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
    <CompanyForm
      v-if="showCompanyDialog"
      @submit="onCompanyFormSubmit"
      @close="showCompanyDialog = false"
    />
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { ITEM_NAMESPACE, CATEGORY_NAMESPACE } from '../../store/namespaces';

import rules from '../../helpers/validationRules';

export default {
  components: {
    AutocompleteWithAdd: () => import('../helpers/AutocompleteWithAdd.vue'),
  },

  props: {
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

    showCompanyDialog: false,

    search: null,
    creatingCategory: false,

    categoriesLoading: false,
  }),

  async beforeMount() {
    this.item = { ...this.itemTemplate, name: this.name };
    this.fetchCategories();
  },

  computed: {
    ...mapGetters(ITEM_NAMESPACE, ['itemList', 'itemsCountByInput']),
    ...mapGetters(CATEGORY_NAMESPACE, ['categoryList']),

    itemsExistTitle() {
      return (this.itemsCountByInput && `${this.itemsCountByInput} элементов с таким именем уже присутсвует`) || '';
    },
  },

  watch: {
    name() {
      this.item = { ...this.itemTemplate, name: this.name };
    },
    item: {
      deep: true,
      handler() {
        const name = this.item.name.trim();
        console.log('--->name', name);
        if (name) {
          this.countItemsByName(name);
        }
      },
    },
  },

  methods: {
    ...mapActions(ITEM_NAMESPACE, ['createItem', 'countItemsByName']),
    ...mapActions(CATEGORY_NAMESPACE, ['createCategory', 'fetchCategories']),

    async onSaveClick() {
      const data = { ...this.item, amount: 0 };

      const result = await this.createItem(data);

      this.item = { ...this.itemTemplate };
      this.$emit('submit', result);
    },

    async createCategory(inputedName) {
      if (!inputedName) {
        return;
      }

      this.creatingCategory = true;

      const data = await this.createCategory({ name: inputedName });

      if (data) {
        this.item.categoryId = data.id;
      }

      this.creatingCategory = false;
    },

    // async onCompanyFormSubmit(company) {

    // },
  },
};
</script>

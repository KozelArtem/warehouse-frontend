<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="purple white--text darken-3">
        <span class="headline">
          {{ (category || {}).name ? 'Добавление нового' : 'Редактирование' }} элемента
        </span>
        <v-spacer></v-spacer>
        <v-icon color="red" @click="$emit('close')">{{icons.close}}</v-icon>
      </v-card-title>
      <v-card-text>
        <CompanyForm
          :dialog="showCompanyDialog"
          @close="showCompanyDialog = false"
          @submit="onNewCompany"
        />
        <v-form v-model="valid">
          <v-container grid-list-md>
            <v-layout column wrap>
              <v-flex v-if="(category || {}).name">
                <v-text-field
                  v-model="category.name"
                  label="Категория"
                  dense
                  disabled
                  hide-details
                />
              </v-flex>
              <v-flex v-else>
                <AutocompleteWithAdd
                  label="Категория"
                  :items="categories"
                  :loading="categoriesLoading"
                  :slotButtonDisabled="creatingCategory"
                  :selectedItemId="item.categoryId || -1"
                  @slotButtonClick="createCategory"
                  @change="categoryId => item.category.id = categoryId"
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
              <v-flex>
                <v-text-field
                  v-model="item.amount"
                  label="Количество"
                  dense
                  type="number"
                  :rules="[required, positiveNumber]"
                  hide-details
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="item.imagePath"
                  label="Изображение"
                  dense
                  hide-details
                />
              </v-flex>
              <v-flex>
                <AutocompleteWithAdd
                  label="Компания"
                  :items="companies"
                  :loading="companiesLoading"
                  :requiredField="false"
                  :slotButtonDisabled="showCompanyDialog"
                  :selectedItemId="item.companyId || -1"
                  @slotButtonClick="showCompanyDialog = true"
                  @change="companyId => item.companyId = companyId"
                />
              </v-flex>
              <v-flex>
                <v-textarea
                  v-model="item.note"
                  label="Заметка"
                  dense
                  hide-details
                />
              </v-flex>
              <v-flex v-for="(_, i) in item.urls" :key="`url${i}`">
                <v-layout row wrap>
                  <v-flex xs6>
                    <v-text-field
                      v-model="item.urls[i].name"
                      :label="`Название ${i + 1}`"
                      dense
                      hide-details
                    />
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="item.urls[i].data"
                      :label="`Ссылка ${i + 1}`"
                      dense
                      hide-details
                      :append-outer-icon="getOuterIcon(i)"
                      @click:append-outer="clickOuterIcon(i)"
                    />
                  </v-flex>
                </v-layout>
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

const {
  createItem,
  updateItem,

  getShortCategoryList,
  createCategory,
  getShortCompanyList,
} = api;

const {
  icons,
} = constants;

export default {
  components: {
    AutocompleteWithAdd: () => import('../helpers/AutocompleteWithAdd.vue'),
    CompanyForm: () => import('../company/CompanyForm.vue'),
  },

  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    category: {
      type: Object,
      default: () => {},
    },
    data: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    icons,
    ...rules,
    // ...constants,

    loading: false,
    valid: false,
    item: {},
    itemTemplate: {
      categoryId: -1,
      name: '',
      amount: 0,
      imagePath: '',
      note: '',
      urls: [{
        name: '',
        data: '',
      }],
    },

    search: null,
    creatingCategory: false,

    categoriesLoading: false,
    categories: [],

    companySearch: null,
    showCompanyDialog: false,
    companiesLoading: false,
    companies: [],
  }),

  beforeMount() {
    this.item = { ...this.itemTemplate };
    this.loadCompanyList();
  },

  watch: {
    category() {
      this.item.category = this.category;
    },

    async data() {
      if (!this.categories.length) {
        await this.loadCategoriesList();
      }

      this.item = {
        ...this.itemTemplate,
        ...this.data,
        categoryId: (this.data.category || {}).id,
      };

      this.item.urls = this.item.urls.length ? this.item.urls : [{ name: '', data: '' }];
    },
  },

  methods: {
    getOuterIcon(i) {
      const firstElement = i === 0;
      const lastElement = i + 1 === this.item.urls.length;

      if (firstElement) {
        return icons.addLink;
      }

      if (lastElement) {
        return icons.close;
      }

      return '';
    },

    clickOuterIcon(i) {
      const outerIcon = this.getOuterIcon(i);

      if (outerIcon === icons.close) {
        this.item.urls.pop();
      } else {
        this.item.urls.push({ name: '', data: '' });
      }
    },

    async onSaveClick() {
      const {
        category,
        name,
        amount,
        imagePath,
        note,
        companyId,
        urls,
      } = this.item;

      const data = {
        categoryId: category.id,
        name,
        amount: +amount,
        imagePath,
        note,
        urls,
        companyId,
      };

      let result;

      this.loading = true;

      if ((this.category || {}).name) {
        result = await createItem(data);
      } else {
        result = await updateItem(this.data.id, data);
      }

      this.loading = false;

      if (!result.id) {
        // TODO add handler
        return;
      }

      this.item = { ...this.itemTemplate };
      this.$emit('submit', result.id);
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

    async loadCompanyList() {
      this.companiesLoading = true;
      this.companies = await getShortCompanyList();
      this.companiesLoading = false;
    },

    onNewCompany(company) {
      this.companies.push(company);

      this.item.companyId = company.id;
      this.showCompanyDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

<template>
  <div>
    <v-dialog :value="true" persistent max-width="600px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">
            {{ (category || {}).name ? 'Добавление нового' : 'Редактирование' }} элемента
          </span>
          <v-spacer></v-spacer>
          <v-icon color="red" @click="$emit('close')">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
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
                  v-model="item.categoryId"
                  label="Категория"
                  :items="categories"
                  :loading="categoriesLoading"
                  :slotButtonDisabled="categoriesLoading"
                  @slotButtonClick="onNewCategoryClick"
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="item.name"
                  label="Наименование"
                  dense
                  hide-details
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="item.amount"
                  label="Количество"
                  dense
                  type="number"
                  :min="0"
                  required
                  hide-details
                />
              </v-flex>
              <v-flex xs6>
                <v-switch label="Загрузить" v-model="upload"></v-switch>
                 <v-file-input
                  v-if="upload"
                  v-model="image"
                  label="Выберите изображение"
                  dense
                  hide-details
                  :loading="imageUploading"
                ></v-file-input>
                <v-text-field
                  v-else
                  v-model="item.imagePath"
                  label="Ссылка на изображение"
                  dense
                  hide-details
                >
                  <template v-slot:prepend>
                    <v-avatar size="30">
                      <ImageWithFullView v-if="item.imagePath" :src="item.imagePath" />
                    </v-avatar>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex>
                <v-textarea
                  v-model="item.note"
                  label="Заметка"
                  dense
                  hide-details
                />
              </v-flex>
              <v-flex v-for="(_, i) in urls" :key="`url${i}`">
                <v-layout row wrap>
                  <v-flex xs6>
                    <v-text-field
                      v-model="urls[i].name"
                      :label="`Название ${i + 1}`"
                      dense
                      hide-details
                    />
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="urls[i].data"
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="green"
            :dark="isValid"
            :loading="loading"
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

import { ITEM_NAMESPACE, CATEGORY_NAMESPACE, UPLOADER_NAMESPACE } from '../../store/namespaces';

export default {
  props: {
    category: {
      type: Object,
      default: () => {},
    },
    data: {
      type: Object,
      default: () => {},
    },
  },

  components: {
    ImageWithFullView: () => import('../helpers/ImageWithFullView.vue'),
    AutocompleteWithAdd: () => import('../helpers/AutocompleteWithAdd.vue'),
  },

  beforeMount() {
    this.item = { ...this.itemTemplate, ...this.data };

    if (this.data && this.data.urls.length) {
      this.urls = this.data.urls.map(url => ({ ...url }));
    }

    if (this.category) {
      this.item.categoryId = this.category.id;
    }

    this.fetchCategories();
  },

  data: () => ({
    upload: false,
    item: {},
    itemTemplate: {
      categoryId: -1,
      name: '',
      amount: 0,
      imagePath: '',
      note: '',
    },
    urls: [
      {
        name: '',
        data: '',
      },
    ],
    image: null,
  }),

  computed: {
    ...mapGetters(CATEGORY_NAMESPACE, { categoriesLoading: 'isLoading', categories: 'categoryList' }),
    ...mapGetters(ITEM_NAMESPACE, { loading: 'isLoading' }),
    ...mapGetters(UPLOADER_NAMESPACE, ['imageUploading']),

    isValid() {
      const { name, categoryId, amount } = this.item;

      if (!categoryId) {
        return false;
      }

      if (name.trim().length < 2) {
        return false;
      }

      if (amount < 0) {
        return false;
      }

      if (this.imageLoading) {
        return false;
      }

      return true;
    },
  },

  watch: {
    async image() {
      if (this.image) {
        this.item.imagePath = await this.uploadImage(this.image);
      }
    },
  },

  methods: {
    ...mapActions(ITEM_NAMESPACE, ['createItem', 'updateItem']),
    ...mapActions(CATEGORY_NAMESPACE, ['createCategory', 'fetchCategories']),
    ...mapActions(UPLOADER_NAMESPACE, ['uploadImage']),

    getOuterIcon(i) {
      const firstElement = i === 0;
      const lastElement = i + 1 === this.urls.length;

      if (firstElement) {
        return 'mdi-link-plus';
      }

      if (lastElement) {
        return 'mdi-close';
      }

      return '';
    },

    clickOuterIcon(i) {
      const outerIcon = this.getOuterIcon(i);

      if (outerIcon === 'mdi-close') {
        this.urls.pop();
      } else {
        this.urls.push({ name: '', data: '' });
      }
    },

    async onSaveClick() {
      let result;

      const data = {
        ...this.item,
        urls: this.urls,
      };

      if ((this.category || {}).name) {
        result = await this.createItem(data);
      } else {
        result = await this.updateItem(data);
      }

      if (!result) {
        // TODO add handler
        return;
      }

      this.item = { ...this.itemTemplate };
      this.$emit('submit', result.id);
    },

    async onNewCategoryClick(inputedName) {
      if (!inputedName) {
        return;
      }
      const data = await this.createCategory({ name: inputedName });

      if (data) {
        this.item.categoryId = data.id;
        this.item.category = data;
      }
    },
  },
};
</script>

<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Добавление нового элемента</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="category.name"
                label="Категория:"
                disabled
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-text-field v-model="item.name" label="Наименование"></v-text-field>
            </v-col>
            <v-col cols="12" sm="7">
              <v-text-field v-mode="item.note" label="Примечание"></v-text-field>
            </v-col>
            <v-col cols="12" sm="2" md="2">
              <v-text-field v-model="item.amount" type="number"
                label="Количество" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="3" md="3">
              <v-text-field v-model="item.imagePath" label="Изображение"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn dark color="blue darken-1" @click="$emit('close')">Закрыть</v-btn>
        <v-btn dark color="green" @click="onSaveClick()" :loading="loading">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '../../api';

const {
  createItem,
} = api;

export default {
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
  },

  data: () => ({
    loading: false,
    item: {},
  }),

  watch: {
    category() {
      this.item.category = this.category;
      console.log(this.item.category.id, this.dialog);
    },
  },

  methods: {
    async onSaveClick() {
      const {
        name,
        amount,
        imagePath,
        note,
      } = this.item;
      const data = {
        categoryId: this.item.category.id,
        name,
        amount,
        imagePath,
        note,
      };
      const result = await createItem(data);

      this.loading = true;

      if (!result) {
        // TODO add handler
        return;
      }

      this.loading = false;
      this.item = {};
      this.$emit('save', result);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

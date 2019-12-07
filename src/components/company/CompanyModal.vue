<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="green lighten-2 white--text">
        <span class="headline">Карта партнера</span>
        <v-spacer></v-spacer>
        <v-icon color="red" @click="onClose()">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="company.name"
                  label="Компания"
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="company.person"
                  label="ФИО"
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="company.description"
                  label="Описание"
                  dense
                  hide-details
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="company.website"
                  label="Сайт"
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="company.email"
                  type="email"
                  label="E-mail"
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="company.location"
                  label="Адрес"
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <span>Телефоны:</span>
                <v-text-field
                  v-for="(_, i) in company.phones" :key="`phone${i}`"
                  v-model="company.phones[i]"
                  dense
                  :placeholder="`Телефон ${i + 1}`"
                  hide-details
                  :append-outer-icon="getIcon(i)"
                  @click:append-outer="clickIcon(i)"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-color-picker
                  v-model="company.color"
                  hide-canvas
                  hide-inputs
                  flat
                  width="500"
                ></v-color-picker>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          dark small color="green"
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

const addIcon = 'mdi-plus';
const removeIcon = 'mdi-close';

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    company: {},

    companyTemplate: {
      name: '',
      person: '',
      description: '',
      location: '',
      website: '',
      phones: [''],
      color: '#FF00FF40',
    },

    valid: false,
    loading: false,
  }),

  beforeMount() {
    this.company = { ...this.companyTemplate };
    this.processData();
  },

  watch: {
    data() {
      this.processData();
    },
  },

  methods: {
    processData() {
      if ((this.data || {}).id) {
        const phones = this.data.phones.map(phone => phone.data);

        this.company = { ...this.data, phones };

        if (!this.company.color) {
          this.company.color = this.companyTemplate.color;
        }
      }
    },

    getIcon(index) {
      const phones = this.company.phones || [];
      const isFirstItem = index === 0;
      const isLastItem = phones.length - 1 === index;

      if (isFirstItem) {
        return addIcon;
      }

      if (isLastItem) {
        return removeIcon;
      }

      return '';
    },

    clickIcon(index) {
      if (index === 0) {
        this.company.phones.push('');
      } else {
        this.company.phones.pop();
      }
    },

    async onSaveClick() {
      this.loading = true;
      let companyRes = null;

      if ((this.data || {}).id) {
        companyRes = await api.updateCompany(this.company.id, this.company);
      } else {
        companyRes = await api.createCompany(this.company);
      }

      this.loading = false;

      if (!companyRes.id) {
        return;
      }

      this.company = { ...this.companyTemplate, phones: [''] };
      this.$emit('submit', companyRes);
    },

    onClose() {
      this.company = { ...this.companyTemplate };
      this.$emit('close');
    },
  },
};
</script>

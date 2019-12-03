<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex xs12>
        <CompanyModal
          v-if="isAdmin()"
          :dialog="newCompanyModal || editCompanyModal"
          :data="editCompanyModal ? selectedCompany : {}"
          @submit="onCompanyModalSubmit"
          @close="newCompanyModal = false; editCompanyModal = false"
        />
      </v-flex>
      <v-flex xs12 style="max-height: 89vh">
        <v-toolbar dense>
          <span>Список компаний</span>
          <v-spacer></v-spacer>
          <v-icon
            v-if="isAdmin()"
            color="primary"
            @click="newCompanyModal = true"
          >
            mdi-plus
          </v-icon>
        </v-toolbar>
      </v-flex>
      <v-flex xs6 sm4 md3 lg2>
        <v-list dense class="elevation-5">
          <v-list-item
            :style="`background-color: ${company.color}`"
            dense
            v-for="(company, i) in companies"
            :key="`company${i}`"
            @click="selectedCompany = company"
          >
            <v-list-item-title>{{ company.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-flex>
      <v-flex xs6 sm8 md9 lg10 v-if="selectedCompany">
        <v-list dense :color="selectedCompany.color" class="elevation-5">
          <v-list-item dense>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-domain</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="d-flex">
                <span class="subtitle-1 d-flex">{{ selectedCompany.name }}</span>
                <v-spacer></v-spacer>
                <v-chip v-if="isAdmin()" color="white" small class="d-flex">
                  <v-icon color="orange" @click="editCompanyModal = true">
                    mdi-pencil
                  </v-icon>
                  <v-icon color="red" @click="removeCompany()">
                    mdi-delete
                  </v-icon>
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item dense>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-account</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ selectedCompany.person }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item v-for="(phone, pi) in selectedCompany.phones" :key="`phone${pi}`">
            <v-list-item-icon>
              <v-icon color="indigo" v-if="pi === 0">mdi-phone</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                <a :href="`tel:${phone.data}`">
                  {{ phone.data }}
                </a>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item dense>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-web</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                <a :href="selectedCompany.website" target="_blank" rel="noopener noreferrer">
                  {{ selectedCompany.website }}
                </a>
              </v-list-item-title>
              <!-- <v-list-item-subtitle>Personal</v-list-item-subtitle> -->
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item dense>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-email</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                <a :href="`mailto:${selectedCompany.email}`">
                  {{ selectedCompany.email }}
                </a>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item dense>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-map-marker</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ selectedCompany.location }}</v-list-item-title>
              <!-- <v-list-item-subtitle>Orlando, FL 79938</v-list-item-subtitle> -->
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item dense>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-plus</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Заказы</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '../../api';

import CompanyModal from './CompanyModal.vue';

const {
  isAdmin,
  getCompaniesWithItems,
  removeCompany,
} = api;


export default {
  components: {
    CompanyModal,
  },

  data: () => ({
    companies: [],
    selectedCompany: null,
    newCompanyModal: false,
    editCompanyModal: false,
  }),

  beforeMount() {
    this.loadData();
  },

  methods: {
    isAdmin,

    async loadData() {
      this.companies = await getCompaniesWithItems();
    },

    onCompanyModalSubmit() {
      this.newCompanyModal = false;
      this.editCompanyModal = false;
      this.selectedCompany = null;
      this.loadData();
    },

    async removeCompany() {
      const message = `Вы действительно хотите удалить компанию"${this.selectedCompany.name}"?`;
      // eslint-disable-next-line no-restricted-globals
      const result = confirm(message);

      if (!result) {
        return;
      }

      await removeCompany(this.selectedCompany.id);

      this.companies = this.companies.filter(company => company.id !== this.selectedCompany.id);
      this.selectedCompany = null;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

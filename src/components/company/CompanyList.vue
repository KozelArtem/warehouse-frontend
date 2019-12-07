<template>
  <v-container grid-list-xs>
    <v-layout column wrap>
      <v-flex xs1>
        <CompanyModal
          v-if="isAdmin() && (newCompanyModal || editCompanyModal)"
          :dialog="newCompanyModal || editCompanyModal"
          :data="editCompanyModal ? selectedCompany : {}"
          @submit="onCompanyModalSubmit"
          @close="newCompanyModal = false; editCompanyModal = false"
        />
      </v-flex>
      <v-flex xs1>
        <v-toolbar dense>
          <span>Список компаний</span>
          <v-spacer></v-spacer>
          <span>
            <v-text-field label="Поиск" hide-details dense v-model="search"/>
          </span>
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
      <v-flex xs2 v-for="company in localCompanies" :key="company.id">
        <v-card :color="company.color">
          <v-card-title primary-title class="pb-0">
            <div class="d-flex headline">{{ company.name }} | {{ company.person }}</div>
            <v-spacer></v-spacer>
            <div v-if="isAdmin()" class="float-right active-buttons">
              <v-icon color="primary" @click="editCompany(company)">mdi-pencil</v-icon>
              <v-icon color="red" @click="removeCompany(company)">mdi-delete</v-icon>
            </div>
          </v-card-title>
          <v-card-text class="pb-0">
            <blockquote>{{ company.description }}</blockquote>
            <v-list v-if="company.showInfo" dense>
              <v-list-item dense>
                <v-list-item-icon>
                  <v-icon color="indigo">mdi-account</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title class="subtitle-2">{{ company.person }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item v-for="(phone, pi) in company.phones" :key="`phone${pi}`">
                <v-list-item-icon>
                  <v-icon color="indigo" v-if="pi === 0">mdi-phone</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title class="subtitle-2">
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
                  <v-list-item-title class="subtitle-2">
                    <a :href="company.website" target="_blank" rel="noopener noreferrer">
                      {{ company.website }}
                    </a>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item dense>
                <v-list-item-icon>
                  <v-icon color="indigo">mdi-email</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title class="subtitle-2">
                    <a :href="`mailto:${company.email}`">
                      {{ company.email }}
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
                  <v-list-item-title class="subtitle-2">{{ company.location }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="company.showInfo = !company.showInfo"
              text color="primary" small
            >
              {{ company.showInfo ? 'Скрыть' : 'Показать' }} контактные данные
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '../../api';

const {
  isAdmin,
  getCompaniesWithItems,
  removeCompany,
} = api;


export default {
  components: {
    CompanyModal: () => import('./CompanyModal.vue'),
  },

  data: () => ({
    companies: [],
    localCompanies: [],
    selectedCompany: null,
    newCompanyModal: false,
    editCompanyModal: false,
    search: null,
  }),

  beforeMount() {
    this.loadData();
  },

  watch: {
    search() {
      this.filterCompanies();
    },
  },

  methods: {
    isAdmin,

    filterCompanies() {
      const searchValue = this.search.trim().toLowerCase();
      this.localCompanies = this.companies
        .filter(company => company.name.toLowerCase().includes(searchValue));
    },

    async loadData() {
      const data = await getCompaniesWithItems();
      this.companies = data.map(company => ({ ...company, showInfo: false }));
      this.localCompanies = this.companies;
    },

    onCompanyModalSubmit() {
      this.newCompanyModal = false;
      this.editCompanyModal = false;
      this.selectedCompany = null;
      this.loadData();
    },

    editCompany(company) {
      this.selectedCompany = company;
      this.editCompanyModal = true;
    },

    async removeCompany(company) {
      const message = `Вы действительно хотите удалить компанию"${company.name}"?`;
      // eslint-disable-next-line no-restricted-globals
      const result = confirm(message);

      if (!result) {
        return;
      }

      await removeCompany(company.id);

      this.companies = this.companies.filter(value => value.id !== company.id);
      this.selectedCompany = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card {
  .active-buttons {
    display: none;
  }

  &:hover {
    .active-buttons {
      display: inline;
    }
  }
}
</style>

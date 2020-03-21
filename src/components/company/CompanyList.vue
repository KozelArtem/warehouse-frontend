<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-toolbar class="blue lighten-3">
          <v-toolbar-title>Список компаний</v-toolbar-title>
          <v-spacer></v-spacer>
          <span :class="['d-flex', {
            'w-200': $vuetify.breakpoint.smAndUp,
            'w-100': $vuetify.breakpoint.xs,
            }
          ]">
            <v-text-field
              label="Поиск"
              append-icon="mdi-magnify"
              dense hide-details
              v-model="search"></v-text-field>
          </span>
        </v-toolbar>
        <v-divider></v-divider>
        <v-progress-linear
          :active="loading"
          indeterminate
          color="blue lighten-3"
          height="7px"
          opacity="0.3"
        ></v-progress-linear>
      </v-flex>
      <v-flex xs12 v-for="company in localCompanies" :key="company.id">
        <v-card :color="company.color">
          <v-card-title primary-title class="pb-0 lh-0">
            <div class="d-flex subtitle-2">{{ company.name }} | {{ company.person }}</div>
            <v-spacer></v-spacer>
            <div v-if="isAdmin()" class="float-right active-buttons">
              <v-icon small color="primary" @click="editCompany(company)">mdi-pencil</v-icon>
              <v-icon small color="red" @click="removeCompany(company)">mdi-delete</v-icon>
            </div>
          </v-card-title>
          <v-card-text class="pb-0">
            <blockquote class="caption">{{ company.description }}</blockquote>
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
      <v-flex xs12>
        <CompanyModal
          v-if="isAdmin() && (newCompanyModal || editCompanyModal)"
          :dialog="newCompanyModal || editCompanyModal"
          :data="editCompanyModal ? selectedCompany : {}"
          @submit="onCompanyModalSubmit"
          @close="newCompanyModal = false; editCompanyModal = false"
        />
      </v-flex>
      <v-btn
        v-if="isAdmin()"
        small
        fixed
        dark
        fab
        bottom
        right
        color="gray"
        @click="newCompanyModal = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
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
    loading: true,
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
      this.loading = true;

      const data = await getCompaniesWithItems();

      this.companies = data.map(company => ({ ...company, showInfo: false }));
      this.localCompanies = this.companies;
      this.loading = false;
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

.lh-0 {
  line-height: 0 !important;
}
</style>

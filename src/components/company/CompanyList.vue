<template>
  <div>
    <CompanyForm
      v-if="isAdmin && companyModal.dialog"
      :data="companyModal.data"
      @submit="closeCompanyModal"
      @close="closeCompanyModal"
    />
    <DeleteModal
      v-if="deleteModal.dialog"
      :title="deleteModal.title"
      :description="deleteModal.description"
      @click="deleteModalResult"
    />
    <v-layout row wrap>
      <v-flex xs12>
        <Toolbar
          title="Список компаний"
          :loading="isLoading"
          @search="updateSearch"
        />
      </v-flex>
      <v-layout wrap style="max-height: 86vh; overflow-y: scroll">
        <v-flex xs12 v-for="company in companies" :key="company.id">
          <CompanyCard
            :company="company"
            :canManage="isAdmin"
            @update="showEditModal"
            @remove="showDeleteModal"
          />
        </v-flex>
      </v-layout>
      <v-btn
        v-if="isAdmin"
        small
        fixed
        dark
        fab
        bottom
        right
        color="gray"
        @click="companyModal.dialog = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

import { COMPANY_NAMESPACE, AUTH_NAMESPACE } from '../../store/namespaces';

export default {
  components: {
    Toolbar: () => import('../helpers/Toolbar.vue'),
    DeleteModal: () => import('../helpers/DeleteModal.vue'),
    CompanyCard: () => import('./CompanyCard.vue'),
    CompanyForm: () => import('./CompanyForm.vue'),
  },

  data: () => ({
    companyModal: {
      dialog: false,
    },
    deleteModal: {
      dialog: false,
      title: 'Удаление компании',
      description: '',
    },
    search: null,
    activeCompany: null,
  }),

  beforeMount() {
    this.fetchExtendedCompanies();
  },

  computed: {
    ...mapGetters(AUTH_NAMESPACE, ['isAdmin']),
    ...mapGetters(COMPANY_NAMESPACE, {
      companies: 'extendedSearchList',
      isLoading: 'isLoading',
    }),
  },

  watch: {
    search() {
      this.updateSearch(this.search);
    },
  },

  methods: {
    ...mapMutations(COMPANY_NAMESPACE, { updateSearch: 'UPDATE_SEARCH' }),
    ...mapActions(COMPANY_NAMESPACE, ['fetchExtendedCompanies', 'deleteCompany']),

    closeCompanyModal() {
      this.companyModal = { dialog: false };
    },

    showEditModal(company) {
      this.companyModal = {
        dialog: true,
        data: { ...company },
      };
    },

    showDeleteModal(company) {
      const title = 'Удаление компании';
      const description = `Вы действительно хотите удалить компанию "${company.name}"?`;

      this.activeCompany = { ...company };
      this.deleteModal = {
        title,
        description,
        dialog: true,
      };
    },

    deleteModalResult(result) {
      if (result) {
        this.deleteCompany(this.activeCompany.id);
      }

      this.deleteModal = { dialog: false };
    },
  },
};
</script>

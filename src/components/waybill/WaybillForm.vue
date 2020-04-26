<template>
  <div>
    <v-card>
      <v-card-title class="grey lighten-3 elevation-2">
        <span class="headline">{{ title }}</span>
        <v-spacer></v-spacer>
        {{ companyName }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div v-if="step === BASE_INFO_STEP">
          <v-text-field
            label="Номер"
            v-model="waybill.number"
            required
          />
          <DatePicker v-model="waybill.date" label="Дата"/>
          <AutocompleteWithAdd
            v-model="waybill.companyId"
            label="Компания"
            :items="companies"
            :loading="companiesLoading"
            :slotButtonDisabled="showCompanyDialog"
            :requiredField="true"
            :dense="false"
            @slotButtonClick="showCompanyDialog = true"
          />
        </div>
        <PurchaseList
          v-else-if="step === SELECT_PURCHASES_STEP"
          class="mt-4"
          :companyId="waybill.companyId"
          @update="onPurchasesUpdate"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="step > 0" text class="mr-3" color="red" @click="step--">
          Назад
        </v-btn>

        <v-btn
          v-if="step !== lastStep"
          :disabled="!baseInfoValid"
          text class="mr-3" color="green"
          @click="step++"
        >
          Далее
        </v-btn>

        <v-btn
          v-else
          :disabled="!waybilLValid" :loading="loading"
          text class="mr-3" color="green"
          @click="submit"
        >
          Добавить
        </v-btn>
      </v-card-actions>
    </v-card>
    <OrderForm
      v-if="showPurchaseDialog"
      @close="showPurchaseDialog = false"
      @submit="addOrder"
    />

    <CompanyForm
      v-if="showCompanyDialog"
      @close="showCompanyDialog = false"
      @submit="onNewCompany"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { COMPANY_NAMESPACE, WAYBILL_NAMESPACE, PURCHASE_NAMESPACE } from '../../store/namespaces';

export default {
  components: {
    OrderForm: () => import('../order/OrderForm.vue'),
    CompanyForm: () => import('../company/CompanyForm.vue'),
    AutocompleteWithAdd: () => import('../helpers/AutocompleteWithAdd.vue'),
    DatePicker: () => import('../helpers/DatePicker.vue'),
    PurchaseList: () => import('./PurchaseList.vue'),
  },

  data: () => ({
    showCompanyDialog: false,
    showPurchaseDialog: false,

    waybill: {
      number: '',
      date: Date.now(),
      companyId: 0,
      purchases: [],
    },

    query: {
      offset: 0,
      limit: 100,
      active: true,
    },

    BASE_INFO_STEP: 0,
    SELECT_PURCHASES_STEP: 1,

    step: 0,
    lastStep: 1,
  }),

  beforeMount() {
    this.fetchCompanies();
    this.fetchPurchases(this.query);
  },

  computed: {
    ...mapGetters(COMPANY_NAMESPACE, { companyList: 'companyList', companiesLoading: 'isLoading' }),
    ...mapGetters(PURCHASE_NAMESPACE, ['purchaseList']),

    companies() {
      return this.companyList.filter(i => !!this.purchaseList.find(p => p.companyId === i.id));
    },

    title() {
      const {
        number,
        date,
      } = this.waybill;

      const numberTitle = number && `№${number}`;

      return `Накладная ${numberTitle} от ${date}`;
    },

    companyName() {
      return (this.companyList.find(i => i.id === this.waybill.companyId) || {}).name || '';
    },

    baseInfoValid() {
      return !!(
        this.waybill.number.trim().length > 2
        && this.waybill.date
        && this.waybill.companyId
      );
    },

    waybilLValid() {
      return this.baseInfoValid && this.waybill.purchases.length;
    },
  },

  methods: {
    ...mapActions(COMPANY_NAMESPACE, ['fetchCompanies']),
    ...mapActions(WAYBILL_NAMESPACE, ['createWaybill']),
    ...mapActions(PURCHASE_NAMESPACE, ['fetchPurchases']),

    onPurchasesUpdate(purchases) {
      this.waybill.purchases = [...purchases];
    },

    async submit() {
      this.loading = true;
      await this.createWaybill(this.waybill);
      this.loading = false;
      this.$router.push('/waybill');
    },

    async onNewCompany(company) {
      this.waybill.companyId = company.id;
      this.showCompanyDialog = false;
    },
  },
};
</script>

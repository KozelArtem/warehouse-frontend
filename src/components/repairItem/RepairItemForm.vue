<template>
   <v-dialog
    :value="true"
    persistent
    :overlay="false"
    max-width="800px"
    transition="dialog-transition"
  >
    <v-card shaped>
      <v-card-title primary-title class="grey lighten-2">
        {{ title }}
        <v-spacer />
        <v-icon @click="close()">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field
                v-model="repairItem.orderNumber"
                label="Номер заказа"
                dense
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-text-field
                v-model="repairItem.amount"
                label="Количество"
                dense
                :min="1"
                type="number"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-autocomplete
                v-model="repairItem.companyId"
                :items="companies"
                :loading="companiesLoading"
                item-value="id"
                item-text="name"
                hide-no-data
                clearable
                dense
                label="Компания"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs6>
              <v-autocomplete
                v-model="repairItem.itemId"
                :items="items"
                :loading="itemsLoading"
                item-value="id"
                item-text="name"
                hide-no-data
                clearable
                dense
                label="Наименование"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs6>
              <v-autocomplete
                v-model="repairItem.machineId"
                :items="machines"
                :loading="machinesLoading"
                item-value="id"
                item-text="name"
                hide-no-data
                clearable
                dense
                label="Оборудование"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs6>
              <DatePicker label="Дата отправки" v-model="repairItem.departureDate" />
            </v-flex>
            <v-flex xs6>
              <DatePicker label="Дата прибытия" v-model="repairItem.arrivalDate" />
            </v-flex>

            <!-- <v-flex xs3 class="mt-5">
              <v-btn
                v-if="data"
                small
                dark
                color="red"
                @click="remove()"
              >
                Удалить
              </v-btn>
            </v-flex> -->
            <v-flex xs3 offset-xs5 class="mt-5">
              <v-switch
                class="mt-0"
                color="orange"
                v-if="repairItem.arrivalDate"
                v-model="repairItem.toWarehouse"
                hide-details
              >
                <template v-slot:label>
                  <span class="orange--text font-weight-bold">
                    На склад
                  </span>
                </template>
              </v-switch>
            </v-flex>
            <v-flex xs2 offset-xs2 class="mt-5">
              <v-btn
                small
                :dark="isValid"
                color="green"
                :disabled="!isValid"
                @click="save()"
              >
                Сохранить
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import {
  REPAIR_ITEM_NAMESPACE, ITEM_NAMESPACE, MACHINE_NAMESPACE, COMPANY_NAMESPACE,
} from '../../store/namespaces';

export default {
  components: {
    DatePicker: () => import('../helpers/DatePicker.vue'),
  },
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
    data: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data: () => ({
    repairItem: {
      orderNumber: '',
      itemId: null,
      machineId: null,
      companyId: null,
      amount: 1,
      departureDate: new Date(),
      arrivalDate: null,
      toWarehouse: false,
    },
  }),

  beforeMount() {
    this.repairItem = { ...this.repairItem, ...this.data };
    this.fetchItems();
    this.fetchMachines();
    this.fetchCompanies();
  },

  computed: {
    ...mapGetters(ITEM_NAMESPACE, { items: 'itemList', itemsLoading: 'isLoading' }),
    ...mapGetters(MACHINE_NAMESPACE, { machines: 'machineList', machinesLoading: 'isLoading' }),
    ...mapGetters(COMPANY_NAMESPACE, { companies: 'companyList', companiesLoading: 'isLoading' }),

    isValid() {
      const {
        itemId,
        amount,
        departureDate,
      } = this.repairItem;

      if (!itemId) {
        return false;
      }
      if (amount < 1) {
        return false;
      }
      if (!departureDate) {
        return false;
      }

      return true;
    },
  },

  methods: {
    ...mapActions(ITEM_NAMESPACE, ['fetchItems']),
    ...mapActions(MACHINE_NAMESPACE, ['fetchMachines']),
    ...mapActions(COMPANY_NAMESPACE, ['fetchCompanies']),
    ...mapActions(REPAIR_ITEM_NAMESPACE, ['createRepairItem', 'updateRepairItem', 'removeRepairItem']),

    close() {
      this.$emit('close');
    },

    // remove() {
    //   this.removeRepairItem(this.repairItem.id);

    //   this.$emit('close');
    // },

    save() {
      if (this.repairItem.id) {
        this.updateRepairItem(this.repairItem);
      } else {
        this.createRepairItem(this.repairItem);
      }

      this.$emit('submit', this.repairItem);
    },
  },
};
</script>

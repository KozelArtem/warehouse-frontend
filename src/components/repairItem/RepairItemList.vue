<template>
  <div>
    <v-layout row wrap>
      <v-flex>
        <RepairItemForm
          v-if="repairItemModal.dialog"
          :title="repairItemModal.title"
          :data="repairItemModal.data"
          @submit="onModalSubmit"
          @close="closeModal()"
        />
        <Toolbar
          title="Валы на реставрацию"
          :loading="isLoading"
          @search="onSearchChange"
        />
        <v-simple-table
          fixed-header
          dense
          class="elevation-10 fixed-table__wrapper"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  class="text-center"
                  v-for="header in headers"
                  :key="header.text"
                  :width="header.width"
                  v-show="header.breakpoint()"
                >
                  {{ header.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="pointer"
                v-for="(repairItem, i) in repairItemList"
                :key="repairItem.id"
              >
                <td v-if="headers[0].breakpoint()">{{ getIndex(i) }}</td>
                <td>
                  {{ repairItem.orderNumber }}
                  <span class="show-on-hover" v-if="isAdmin">
                    <v-icon
                      @click.stop="showEditModal(repairItem)"
                      small
                    >
                      mdi-lead-pencil
                    </v-icon>
                  </span>
                </td>
                <td v-if="repairItem.toWarehouse">Склад</td>
                <td v-else>
                  <router-link :to="`./machines/${repairItem.machineId}`" class="black--text">
                    {{ (repairItem.machine || {}).name }}
                  </router-link>
                </td>
                <td>
                  <router-link :to="`./items/${repairItem.itemId}`" class="black--text">
                    {{ (repairItem.item || {}).name }}
                  </router-link>
                </td>
                <td>{{ (repairItem.company || {}).name }}</td>
                <td class="text-center">{{ repairItem.amount }}</td>
                <td class="text-center">{{ repairItem.departureDate | date }}</td>
                <td class="text-center">{{ repairItem.arrivalDate | date }}</td>
              </tr>
            </tbody>
            <TablePagination
              :totalPages="totalPages"
              :headersLength="headers.length"
              @change="pageChange"
            />
          </template>
        </v-simple-table>
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
      color="brown lighten-2"
      @click="showAddModal()"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { AUTH_NAMESPACE, REPAIR_ITEM_NAMESPACE } from '../../store/namespaces';

export default {
  components: {
    RepairItemForm: () => import('./RepairItemForm.vue'),
    Toolbar: () => import('../helpers/Toolbar.vue'),
    TablePagination: () => import('../helpers/TablePagination.vue'),
  },
  data: vm => ({
    headers: [
      {
        text: '№',
        width: '5%',
        breakpoint: () => vm.$vuetify.breakpoint.smAndUp,
      },
      {
        text: 'Номер заказа',
        width: '10%',
        breakpoint: () => true,
      },
      {
        text: 'Склад / Оборуд-ние',
        width: '10%',
        breakpoint: () => true,
      },
      {
        text: 'Наименование',
        width: '33%',
        breakpoint: () => true,
      },
      {
        text: 'Компания',
        width: '15%',
        breakpoint: () => true,
      },
      {
        text: 'Кол-во',
        width: '7%',
        breakpoint: () => true,
      },
      {
        text: 'Дата отправления',
        width: '10%',
        breakpoint: () => true,
      },
      {
        text: 'Дата прибытия',
        width: '10%',
        breakpoint: () => true,
      },
    ],

    query: {
      search: '',
      limit: 10,
      offset: 0,
    },

    repairItemModal: {
      title: '',
      dialog: false,
      data: {},
    },

    page: 1,
  }),

  beforeMount() {
    this.fetchRepairItems(this.query);
  },

  computed: {
    ...mapGetters(REPAIR_ITEM_NAMESPACE, ['totalCount', 'repairItemList', 'isLoading']),
    ...mapGetters(AUTH_NAMESPACE, ['isAdmin']),

    totalPages() {
      return Math.ceil(this.totalCount / this.query.limit);
    },
  },

  watch: {
    query: {
      deep: true,
      handler() {
        this.fetchRepairItems(this.query);
      },
    },
  },

  methods: {
    ...mapActions(REPAIR_ITEM_NAMESPACE, ['fetchRepairItems', 'createRepairItem']),

    getIndex(i) {
      return this.query.limit * (this.page - 1) + i + 1;
    },

    onSearchChange(search) {
      this.query.search = search;
    },

    pageChange({ limit, offset, page }) {
      this.page = page;
      this.query = { ...this.query, limit, offset };
    },

    closeModal() {
      this.repairItemModal = {
        dialog: false,
      };
    },

    onModalSubmit() {
      this.closeModal();
    },

    showAddModal() {
      this.repairItemModal = {
        dialog: true,
        title: 'Добавление',
        data: {},
      };
    },

    showEditModal(repairItem) {
      this.repairItemModal = {
        dialog: true,
        title: 'Редактирование',
        data: { ...repairItem },
      };
    },
  },
};
</script>

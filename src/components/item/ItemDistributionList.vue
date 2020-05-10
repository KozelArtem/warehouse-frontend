<template>
  <div>
    <ItemDistributionModal
      v-if="dialog"
      :itemId="itemId"
      :data="editedItem"
      @close="closeModal()"
      @submit="onModalSubmit()"
    />
    <v-alert v-if="!localItems.length" type="info" outlined :value="true">
      Нет расходов
      <v-btn
        v-if="isAdmin"
        class="float-right"
        small
        color="success"
        outlined
        @click="dialog = true"
      >
        Добавить
      </v-btn>
    </v-alert>
    <v-simple-table v-else dense class="elevation-10" style="position: relative">
      <template v-slot:default>
        <thead>
          <tr>
            <th
              class="body-2 font-weight-bold"
              v-for="(header, i) in headers"
              :key="`header${i}`"
              :width="header.width"
            >
              {{ header.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in localItems"
            :key="item.id"
          >
          <td>{{ i + 1 }}</td>
          <td>
            {{ item.place.name }}
            <span class="show-on-hover" v-if="isAdmin">
              <v-icon @click="openEditDialog(item)" color="gray" small>mdi-lead-pencil</v-icon>
            </span>
          </td>
          <td>
            <router-link v-if="item.waybill" :to="`waybill/${item.waybill.id}`">
              {{ item.waybill.number }}
            </router-link>
          </td>
          <td>{{ item.date | date }}</td>
          <td>{{ item.amount }} </td>
          </tr>
        </tbody>
        <v-btn
          fab
          color="green"
          bottom
          xSmall
          right
          absolute
          dark
          @click="dialog = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { AUTH_NAMESPACE, ITEM_NAMESPACE } from '../../store/namespaces';

export default {
  components: {
    ItemDistributionModal: () => import('./ItemDistributionModal.vue'),
  },

  props: {
    itemId: {
      type: [Number, String],
      required: true,
      default: 0,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },

  data: () => ({
    headers: [
      {
        name: '№',
        width: '10%',
      },
      {
        name: 'Место',
        width: '30%',
      },
      {
        name: 'Накладная',
        width: '20%',
      },
      {
        name: 'Дата',
        width: '20%',
      },
      {
        name: 'Количество',
        width: '20%',
      },
    ],

    dialog: false,
    editedItem: {},
  }),

  computed: {
    ...mapGetters(AUTH_NAMESPACE, ['isAdmin']),

    localItems() {
      return this.items.slice();
    },
  },

  watch: {
    itemId() {
      this.loadPlaces();
      this.loadWaybills();
    },
  },

  methods: {
    ...mapActions(ITEM_NAMESPACE, ['loadItem']),

    closeModal() {
      this.dialog = false;
    },

    onModalSubmit() {
      this.closeModal();
      this.loadItem(this.itemId);
    },

    openEditDialog(item) {
      this.editedItem = { ...item };
      this.dialog = true;
    },
  },
};
</script>

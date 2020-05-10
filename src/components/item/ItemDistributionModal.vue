<template>
  <v-dialog :value="true" persistent max-width="600px">
    <v-card shaped>
      <v-card-title class="grey">
        <span class="headline">Списание</span>
        <v-spacer></v-spacer>
        <v-icon color="red" @click="$emit('close')">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-layout column>
          <v-flex>
            <AutocompleteWithAdd
              v-model="itemDistribution.placeId"
              label="Наименование"
              :items="places"
              :dense="false"
              :loading="placesLoading"
              :slotButtonDisabled="placesLoading"
              @slotButtonClick="onNewPlace"
            />
          </v-flex>
          <v-flex>
            <v-autocomplete
              v-model="itemDistribution.waybillId"
              :items="localWaybills"
              :loading="waybillsLoading"
              hide-no-data
              clearable
              label="Накладная"
            ></v-autocomplete>
          </v-flex>
          <v-flex>
            <DatePicker label="Дата добавления" v-model="itemDistribution.date" />
          </v-flex>
          <v-flex>
            <v-text-field
              v-model="itemDistribution.amount"
              label="Количество"
              type="number"
              :min="0"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="green"
          :dark="isValid"
          :disabled="!isValid"
          @click="save()"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { DISTRIBUTION_NAMESPACE, WAYBILL_NAMESPACE } from '../../store/namespaces';

import { format as formatDate } from '../../helpers/dates';

export default {
  props: {
    itemId: {
      type: [String, Number],
      required: true,
      default: 0,
    },
    data: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  components: {
    AutocompleteWithAdd: () => import('../helpers/AutocompleteWithAdd.vue'),
    DatePicker: () => import('../helpers/DatePicker.vue'),
  },

  beforeMount() {
    this.fetchPlaces();
    this.fetchWaybills({ itemId: this.itemId });

    this.itemDistribution = {
      ...this.itemDistribution,
      ...this.data,
      itemId: this.itemId,
      // placeId: this.data.place && this.data.place.id,
    };
  },

  data: () => ({
    itemDistribution: {
      itemId: 0,
      placeId: 0,
      waybillId: 0,
      date: Date.now(),
      amount: 0,
    },
  }),

  computed: {
    ...mapGetters(DISTRIBUTION_NAMESPACE, { places: 'placeList', placesLoading: 'isLoading' }),
    ...mapGetters(WAYBILL_NAMESPACE, { waybills: 'waybills', waybillsLoading: 'isLoading' }),

    localWaybills() {
      return this.waybills.map(i => ({
        value: i.id,
        text: `${i.number} - ${formatDate(i.date)}`,
      }));
    },

    isValid() {
      const { placeId, date, amount } = this.itemDistribution;

      if (!placeId) {
        return false;
      }

      if (!date) {
        return false;
      }

      if (amount < 1) {
        return false;
      }

      return true;
    },
  },

  methods: {
    ...mapActions(DISTRIBUTION_NAMESPACE, [
      'fetchPlaces',
      'createPlace',
      'createDistribution',
      'updateDistribution',
    ]),
    ...mapActions(WAYBILL_NAMESPACE, ['fetchWaybills']),

    async onNewPlace(data) {
      if (!data) {
        return;
      }

      const place = await this.createPlace({ name: data });

      if (place) {
        this.itemDistribution.placeId = place.id;
      }
    },

    async save() {
      let responseData;

      if (this.itemDistribution.edit) {
        responseData = await this.updateDistribution(this.itemDistribution);
      } else {
        responseData = await this.createDistribution(this.itemDistribution);
      }

      this.$emit('submit', responseData.id);
    },
  },
};
</script>

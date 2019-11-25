<template>
 <v-autocomplete
    :label="label"
    :items="localItems"
    :loading="loading"
    :search-input.sync="search"
    :rules="rules"
    v-model="selected"
    dense
    :allow-overflow="false"
    :item-value="value"
    :item-text="text"
    hide-details
    :menu-props="menuProps"
    @change="$emit('change', selected)"
  >
    <template v-slot:no-data>
      <v-btn
        text
        color="success"
        block
        small
        :disabled="slotButtonDisabled"
        @click="$emit('slotButtonClick', search)"
      >Добавить</v-btn>
    </template>
  </v-autocomplete>
</template>

<script>
import rules from '../../helpers/validationRules';

export default {
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    loading: {
      type: Boolean,
      required: true,
      default: true,
    },
    label: {
      type: String,
      required: true,
      default: '',
    },
    slotButtonDisabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    value: {
      type: String,
      default: 'id',
    },
    text: {
      type: String,
      default: 'name',
    },
    requiredField: {
      type: Boolean,
      default: true,
    },
    selectedItemId: {
      type: [Number, String],
      required: true,
      default: '0',
    },
  },

  data: () => ({
    search: null,

    selected: 0,

    menuProps: {
      closeOnContentClick: true,
      offsetY: true,
      offsetOverflow: true,
    },
  }),

  beforeMount() {
    this.selected = this.selectedItemId;
  },

  computed: {
    localItems() {
      return this.items || [];
    },

    rules() {
      return this.requiredField ? [rules.required] : [];
    },
  },

  watch: {
    selectedItemId() {
      this.selected = this.selectedItemId;
    },
    search() {
      this.$emit('search', this.search);
    },
  },
};
</script>

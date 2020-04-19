<template>
 <v-autocomplete
    :label="label"
    :items="localItems"
    :loading="loading"
    :disabled="loading"
    :search-input.sync="search"
    :rules="rules"
    v-model="selected"
    dense
    :allow-overflow="false"
    :item-value="itemKey"
    :item-text="itemText"
    hide-details
    :clearable="clearable"
    :menu-props="menuProps"
    @change="$emit('input', selected)"
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
    itemKey: {
      type: String,
      default: 'id',
    },
    itemText: {
      type: String,
      default: 'name',
    },
    requiredField: {
      type: Boolean,
      default: true,
    },
    value: {
      type: [Number, String],
      required: true,
      default: '0',
    },
    clearable: {
      type: Boolean,
      default: false,
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
    this.selected = this.value;
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
    value() {
      this.selected = this.value;
    },
    search() {
      this.$emit('search', this.search);
    },
  },
};
</script>

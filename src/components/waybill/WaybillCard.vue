<template>
  <v-card
    max-width="150px"
    min-width="150px"
    class="pa-2 pointer"
    :to="`waybill/${waybill.id}`"
  >
    <div class="overflow-hidden subtitle-2 text-truncate">
      {{ waybill.number }}
    </div>
    <v-card-subtitle class="subtitle-2 pa-0">
      {{ waybill.date | date }}
    </v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  props: {
    waybill: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
};
</script>

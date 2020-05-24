<template>
  <v-card
    max-width="150px"
    min-width="150px"
    class="pa-2 pointer mx-0 elevation-3"
    :to="`waybill/${waybill.id}`"
    color="#FFCB9A"
  >
    <div class="overflow-hidden subtitle-2 text-truncate text-center">
      {{ waybill.number }}
    </div>
    <v-card-subtitle class="subtitle-2 pa-0 text-center">
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

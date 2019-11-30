<template>
 <v-dialog
      v-model="dialog"
      scrollable fullscreen
      persistent :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="purple white--text darken-3">
          <span class="headline" v-if="waybill">
            {{ waybill.number }} {{ waybill.date }}
          </span>
          <v-spacer></v-spacer>
          <v-icon color="red" @click="$emit('close')">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="items"
            hide-default-footer
            class="elevation-1"
            item-key="id"
          >
            <template v-slot:item.action="{ item }">
              <v-icon>mdi-pencil</v-icon>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    waybill: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    headers: [
      {
        text: 'Наименование', value: 'name',
      },
      {
        text: 'Количество', value: 'amount',
      },
      {
        text: 'Дата', value: 'date',
      },
      {
        text: 'Компания', value: 'company',
      },
      {
        text: '', value: 'action', width: 1,
      },
    ],
    items: [
      {
        id: 1, name: 'ADASd', amount: 123, date: Date.now(), company: 'Amigo',
      },
      {
        id: 2, name: 'ADASd', amount: 123, date: Date.now(), company: 'Amigo',
      },
      {
        id: 3, name: 'ADASd', amount: 123, date: Date.now(), company: 'Amigo',
      },
      {
        id: 4, name: 'ADASd', amount: 123, date: Date.now(), company: 'Amigo',
      },
    ],
  }),
};
</script>

<style lang="scss" scoped>

</style>

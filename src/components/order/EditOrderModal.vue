<template>
  <v-form v-model="valid">
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex>
          <v-text-field
            :rules="[required, positive]"
            label="Количество"
            v-model="order.orderAmount"
            type="number"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-menu
            v-model="datePickerMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="order.date"
                label="Дата"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="order.date"
              @input="datePickerMenu = false"
              locale="ru-RU"
            ></v-date-picker>
          </v-menu>
          <v-spacer></v-spacer>
        </v-flex>
        <v-flex xs2 offset-xs10 class="text-xs-right">
          <v-btn color="success" block @click="onSave" :loading="formLoading">Сохранить</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>

</style>

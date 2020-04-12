<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card class="elevation-5">
      <v-card-title :style="company.style" class="green lighten-2 white--text">
        <span class="headline">Карта партнера</span>
        <v-spacer></v-spacer>
        <v-icon @click="$emit('close')">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item dense>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-domain</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="subtitle-1">{{ company.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item dense>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-account</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="subtitle-2">{{ company.person }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item dense>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-information</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              {{ company.description }}
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item v-for="(phone, pi) in company.phones" :key="`phone${pi}`">
            <v-list-item-icon>
              <v-icon color="indigo" v-if="pi === 0">mdi-phone</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="subtitle-2">
                <a :href="`tel:${phone.data}`">
                  {{ phone.data }}
                </a>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item dense>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-web</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="subtitle-2">
                <a :href="company.website" target="_blank" rel="noopener noreferrer">
                  {{ company.website }}
                </a>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item dense>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-email</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="subtitle-2">
                <a :href="`mailto:${company.email}`">
                  {{ company.email }}
                </a>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item dense>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-map-marker</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="subtitle-2">{{ company.location }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

import { COMPANY_NAMESPACE } from '../../store/namespaces';

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    companyId: {
      type: [Number, String],
      required: true,
      default: 0,
      validator: val => val > 0,
    },
  },

  data: () => ({
    company: {},
  }),

  watch: {
    companyId() {
      this.loadCompany();
    },
  },

  beforeMount() {
    this.loadCompany();
  },

  methods: {
    ...mapActions(COMPANY_NAMESPACE, ['getCompanyById']),

    async loadCompany() {
      this.company = await this.getCompanyById(this.companyId);

      this.company.style = `background: ${this.company.color}`;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

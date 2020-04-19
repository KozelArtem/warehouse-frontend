<template>
  <v-card :color="company.color">
    <v-card-title primary-title class="pb-0 lh-0">
      <div class="d-flex subtitle-2">{{ company.name }} | {{ company.person }}</div>
      <v-spacer></v-spacer>
      <div v-if="canManage" class="float-right active-buttons">
        <v-icon small color="primary" @click="$emit('update', company)">mdi-pencil</v-icon>
        <v-icon small color="red" @click="$emit('remove', company)">mdi-delete</v-icon>
      </div>
    </v-card-title>
    <v-card-text class="pb-0">
      <blockquote class="caption">{{ company.description }}</blockquote>
      <v-menu
        v-model="showInfo"
        :close-on-content-click="false"
        :nudge-width="200"
        nudge-bottom
        offset-x
      >
        <template v-slot:activator="{ on }">
         <v-btn
            v-on="on"
            text
            color="primary"
            small
          >
            контактные данные
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item dense>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-account</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="subtitle-2">{{ company.person }}</v-list-item-title>
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
      </v-menu>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    company: {
      type: Object,
      required: true,
      default: () => {},
    },
    canManage: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    showInfo: false,
  }),
};
</script>

<style lang="scss" scoped>
.v-card {
  .active-buttons {
    display: none;
  }

  &:hover {
    .active-buttons {
      display: block;
    }
  }
}
.lh-0 {
  line-height: 0 !important;
}
</style>

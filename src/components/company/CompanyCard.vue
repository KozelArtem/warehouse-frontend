<template>
  <v-card class="mb-1">
    <v-card-title primary-title class="pb-0 lh-0">
      <div class="d-flex subtitle-2">{{ company.name }} | {{ company.person }}</div>
      <v-spacer></v-spacer>
      <v-menu bottom v-if="canManage">
        <template v-slot:activator="{ on }">
          <v-btn small icon v-on="on">
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item
            dense
            v-for="(item, i) in items"
            :key="i"
            @click="$emit(item.event, company)"
          >
            <v-list-item-icon>
              <v-icon :color="item.color" v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-text>
      <blockquote class="caption">{{ company.description }}</blockquote>
      <v-list dense v-if="showInfo" transition="slide-x-transition">
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
    </v-card-text>
    <v-card-actions>
      <v-btn
        @click="showInfo = !showInfo"
        text
        small
      >
        Контактные данные
      </v-btn>
    </v-card-actions>
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
    items: [
      {
        title: 'Редактировать',
        event: 'update',
        color: 'primary',
        icon: 'mdi-pencil',
      },
      {
        title: 'Удалить',
        event: 'remove',
        color: 'red',
        icon: 'mdi-delete',
      },
    ],
  }),
};
</script>

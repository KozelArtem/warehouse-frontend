<template>
  <v-app>
    <AppWrapper />
    <v-content style="background: linear-gradient(90deg, grey, transparent);">
      <v-container fill-height fluid wrap>
        <v-layout row wrap>
          <v-flex class="px-5">
            <router-view />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-bottom-sheet left :value="alert.show" inset hide-overlay @input="closeAlert">
      <v-alert
        text
        dismissible
        class="ma-0"
        border="left"
        :type="alert.type"
        :value="alert.show"
        @input="closeAlert"
      >
        {{ alert.message }}
      </v-alert>
    </v-bottom-sheet>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import AppWrapper from './components/helpers/AppWrapper.vue';

export default {
  name: 'App',
  components: {
    AppWrapper,
  },

  computed: {
    ...mapGetters(['alert']),
  },
  methods: {
    ...mapMutations({ closeAlert: 'CLOSE_ALERT' }),
  },
};
</script>

<style lang="scss">
#appToolbar {
  border-bottom-color: rgba(0,0,0,.2)!important;
  border-bottom: 1px solid black;
}

.pointer {
  cursor: pointer;
};
tr, span {
  .show-on-hover {
    display: none;
  }

  &:hover {
    .show-on-hover {
      display: inline;
    }
  }
}

.w-200 {
  width: 200px;
}

.w-100 {
  width: 100px;
}

input[type="button"]{
  outline: none !important;
}

.v-data-table__wrapper {
  overflow: visible !important;
}
.fixed-table__wrapper {
  table {
    width: 100%;
    table-layout: fixed !important;
    border-collapse: collapse;

    .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    thead {
      tr {
        th {
          // border: thin solid rgba(0, 0, 0, 0.4) !important;
          background: rgba(189, 189, 189, 0.4) !important;
          color: white;


          &:last-child {
            border: none;
          }
        }
      }
    }

    td:not(:last-child) {
      border: thin solid rgba(0, 0, 0, 0.12) !important;
      background: white;
      color: black;
    }

    tr {
      td {
        min-width: 50px;
      }
      &:hover {
        td {
          background: rgba(0,0,0,0.12);
        }
      }
    }

    tfoot {
      td {
        background: rgba(189, 189, 189, 0.4);
      }
    }
  }
}

.v-text-field.v-input--dense .v-input__prepend-inner .v-input__icon > .v-icon,
.v-text-field.v-input--dense .v-input__append-inner .v-input__icon > .v-icon {
  margin-top: 0 !important;
}

.theme--light.v-pagination {
  .v-pagination__item {
    background: rgba(189, 189, 189, 0.4) !important;
    color: rgba(0, 0, 0, 0.87);
  }
  .v-pagination__navigation {
    background: transparent !important;
  }
  .v-pagination__item--active {
    background: #2C3531 !important;
  }
}

</style>

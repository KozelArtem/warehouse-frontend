<template>
  <v-menu
    v-model="menu"
    bottom
    offset-y
    nudge-bottom="5"
    origin="center center"
    transition="scale-transition"
    max-height="400"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="search"
        @input="menu = true"
        v-on="on"
        solo
        rounded
        dense
        label="Поиск..."
        clearable
        autocomplete="off"
        hide-details
        prepend-inner-icon="mdi-magnify"
        :loading="searchLoading"
        @click:clear="clearSearch()"
      >

      </v-text-field>
    </template>
    <v-list v-if="foundItems.length">
      <span v-for="item in foundItems" :key="item.id">
        <v-list-item dense @click="clearSearch()" :to="getItemRouteParams(item)">
          <v-list-item-content>
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <router-link
                @click="clearSearch()"
                :to="getCategoryRouteParams(item)"
              >
                {{ item.categoryName }}
              </router-link>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-arrow-right-bold</v-icon>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
      </span>
    </v-list>
  </v-menu>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { ITEM_NAMESPACE } from '../../store/namespaces';

export default {
  data: () => ({
    search: '',
    menu: false,
  }),

  computed: {
    ...mapGetters(ITEM_NAMESPACE, ['foundItems', 'searchLoading']),
  },

  watch: {
    search() {
      const search = this.search.trim();

      if (search) {
        this.searchItems(search);
      }
    },
  },

  methods: {
    ...mapMutations(ITEM_NAMESPACE, ['SET_FOUND_ITEMS']),
    ...mapActions(ITEM_NAMESPACE, ['searchItems']),

    clearSearch() {
      this.SET_FOUND_ITEMS([]);
      this.search = '';
    },

    getItemRouteParams(item) {
      return { name: 'itemView', params: { itemId: item.id } };
    },

    getCategoryRouteParams(item) {
      return { name: 'categoryView', params: { categoryId: item.categoryId } };
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

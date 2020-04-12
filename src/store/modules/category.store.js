import httpClient from '../../api/httpClient';

const URL = '/categories';

const initialState = () => ({
  loading: false,
  categories: [],
  category: {},
  shortCategoryInfo: {},
});

const localState = initialState();

const getters = {
  categoryList(state) {
    return state.categories.slice(0);
  },
};

const actions = {
  async fetchCategories({ commit, state }) {
    if (state.categories.length) {
      return;
    }

    commit('SET_LOADING', true);
    const response = await httpClient.get(URL);

    commit('SET_CATEGORIES', response.data);
    commit('SET_LOADING', false);
  },

  async fetchCategoryInfo({ commit }, id) {
    commit('SET_LOADING', true);
    const response = await httpClient.get(`${URL}/${id}`);

    commit('SET_CATEGORY_INFO', response.data);
    commit('SET_LOADING', false);

    return response.data;
  },
};

const mutations = {
  SET_LOADING(state, payload) {
    state.loading = payload;
  },

  SET_CATEGORIES(state, payload) {
    state.categories = payload;
  },

  SET_CATEGORY_INFO(state, payload) {
    state.category = payload;
  },
};

export default {
  namespaced: true,
  state: localState,
  getters,
  actions,
  mutations,
};

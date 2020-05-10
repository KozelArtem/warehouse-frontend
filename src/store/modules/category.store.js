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
  categoryList: state => state.categories.slice(0),
  isLoading: state => state.loading,
  category: state => ({ ...state.category }),
};

const actions = {
  async fetchCategories({ commit, state }, needLoad = false) {
    if (state.categories.length && !needLoad) {
      return;
    }

    commit('SET_LOADING', true);
    const response = await httpClient.get(URL);

    commit('SET_CATEGORIES', response.data);
    commit('SET_LOADING', false);
  },
  async createCategory({ commit, dispatch }, data) {
    commit('SET_LOADING', true);
    const response = await httpClient.post(URL, data);

    commit('SET_LOADING', false);
    dispatch('fetchCategories', true);

    return response.data;
  },
  async updateCategory({ commit, dispatch }, { id, ...data }) {
    commit('SET_LOADING', true);
    const response = await httpClient.put(`${URL}/${id}`, data);

    commit('SET_LOADING', false);
    dispatch('fetchCategories', true);

    return response.data;
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

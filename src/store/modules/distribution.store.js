import httpClient from '../../api/httpClient';

const URL = '/distribution';
const URL_PLACES = `${URL}/places`;

const initialState = () => ({
  places: [],
  distribution: {},
  loading: false,
});

const localState = initialState();

const getters = {
  isLoading: state => state.loading,
  placeList: state => state.places.slice(0),
  distributionInfo: state => state.distribution,
};

const actions = {
  async fetchPlaces({ state, commit }, reload = false) {
    if (state.places.length && !reload) {
      return;
    }

    commit('SET_LOADING', true);

    const response = await httpClient.get(URL_PLACES);

    if (response) {
      commit('SET_PLACES', response.data);
    }

    commit('SET_LOADING', false);
  },
  async createPlace({ commit, dispatch }, data) {
    commit('SET_LOADING', true);

    const response = await httpClient.post(URL_PLACES, data);

    dispatch('fetchPlaces', true);
    commit('SET_LOADING', false);

    return response.data;
  },
  async fetchDistributionInfo({ commit }, id) {
    commit('SET_LOADING', true);

    const response = await httpClient.get(`${URL}/${id}`);

    commit('SET_DISTRIBUTION_INFO', response.data);
    commit('SET_LOADING', false);

    return response.data;
  },
  async createDistribution({ commit }, data) {
    commit('SET_LOADING', true);

    const response = await httpClient.post(URL, data);

    commit('SET_LOADING', false);

    return response.data;
  },
  async updateDistribution({ commit }, { id, ...data }) {
    commit('SET_LOADING', true);

    const response = await httpClient.put(`${URL}/${id}`, data);

    commit('SET_LOADING', false);

    return response.data;
  },
};

const mutations = {
  SET_DISTRIBUTION_INFO(state, payload) {
    state.distribution = payload;
  },
  SET_PLACES(state, payload) {
    state.places = payload;
  },
  SET_LOADING(state, value) {
    state.loading = value;
  },
};

export default {
  namespaced: true,
  state: localState,
  getters,
  actions,
  mutations,
};

import httpClient from '../../api/httpClient';

const URL = '/workers';

const initialState = () => ({
  loading: false,
  workers: [],
});

const localState = initialState();

const getters = {
  workerList: state => state.workers.slice(0),
  isLoading: state => state.loading,
};

const actions = {
  async fetchWorkers({ commit, state }, { needLoad = false, ...params }) {
    if (state.workers.length && !needLoad) {
      return;
    }

    commit('SET_LOADING', true);
    const response = await httpClient.get(URL, { params });

    commit('SET_WORKERS', response.data);
    commit('SET_LOADING', false);
  },
};

const mutations = {
  SET_LOADING(state, payload) {
    state.loading = payload;
  },
  SET_WORKERS(state, payload) {
    state.workers = payload;
  },
};

export default {
  namespaced: true,
  state: localState,
  getters,
  actions,
  mutations,
};

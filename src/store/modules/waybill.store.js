import httpClient from '../../api/httpClient';
import { getTotalCountFromHeaders } from '../../api/helper';

const URL = '/waybills';

let timeout = null;

const initialState = () => ({
  waybills: [],
  waybillInfo: {},
  totalCount: 0,
  loading: false,
});

const localState = initialState();

const getters = {
  totalPages: state => Math.ceil(state.totalCount / state.query.limit),
  isLoading: state => state.loading,
  newWaybill: state => state.newWaybill,

  waybillList(state) {
    return state.waybills
      .slice(0)
      .filter(item => !!item)
      .sort((a, b) => b.waybills.length - a.waybills.length);
  },

  waybillInfo: state => state.waybillInfo,
};

const actions = {
  async fetchWaybills({ commit }, params) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(async () => {
      commit('SET_LOADING', true);

      const response = await httpClient.get(URL, { params });

      if (response) {
        commit('SET_WAYBILLS', response);
      }

      commit('SET_LOADING', false);
    }, 300);
  },
  async getWaybillInfo({ commit }, id) {
    commit('SET_LOADING', true);

    const response = await httpClient.get(`${URL}/${id}`);

    if (response.data) {
      commit('SET_WAYBILL_INFO', response.data);
    }

    commit('SET_LOADING', false);
  },
  async createWaybill({ commit, dispatch }, data) {
    commit('SET_LOADING', true);

    const response = await httpClient.post(URL, data);

    dispatch('fetchWaybills');
    commit('SET_LOADING', false);

    return response.data;
  },
};

const mutations = {
  SET_WAYBILLS(state, response) {
    state.waybills = response.data;
    state.totalCount = getTotalCountFromHeaders(response);
  },
  SET_WAYBILL_INFO(state, payload) {
    state.waybillInfo = payload;
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

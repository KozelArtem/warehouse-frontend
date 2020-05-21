import httpClient from '../../api/httpClient';
import { getTotalCountFromHeaders } from '../../api/helper';

const URL = '/repairItems';

const initialState = () => ({
  repairItems: [],
  repairItem: {},
  totalCount: 0,
  loading: false,
});

const localState = initialState();

const getters = {
  totalCount: state => state.totalCount,
  repairItemList: state => state.repairItems.slice(0),
  repairItem: state => ({ ...state.repairItem }),
  isLoading: state => state.loading,
};

const actions = {
  async fetchRepairItems({ commit }, params) {
    commit('SET_LOADING', true);

    const response = await httpClient.get(URL, { params });

    if (response) {
      commit('SET_REPAIR_ITEMS', response);
    }

    commit('SET_LOADING', false);
  },
  async createRepairItem({ dispatch }, data) {
    await httpClient.post(URL, data);

    dispatch('fetchRepairItems');
  },
  async updateRepairItem({ dispatch }, { id, ...data }) {
    await httpClient.put(`${URL}/${id}`, data);

    dispatch('fetchRepairItems');
  },
  async removeRepairItem({ dispatch, commit }, id) {
    commit('SET_LOADING', true);

    await httpClient.delete(`${URL}/${id}`);

    commit('SET_REPAIR_ITEM_INFO', {});
    commit('SET_LOADING', false);
    dispatch('fetchRepairItems');
  },
  async fetchRepairItemInfo({ state, commit }, id) {
    if (id === state.repairItem.id) {
      return;
    }

    commit('SET_LOADING', true);

    const response = await httpClient.get(`${URL}/${id}`);

    commit('SET_REPAIR_ITEM_INFO', response.data);
    commit('SET_LOADING', false);
  },
};

const mutations = {
  SET_REPAIR_ITEMS(state, response) {
    state.repairItems = response.data;
    state.totalCount = getTotalCountFromHeaders(response);
  },
  SET_LOADING(state, value) {
    state.loading = value;
  },
  SET_REPAIR_ITEM_INFO(state, payload) {
    state.repairItem = { ...state.repairItem, ...payload };
  },
};

export default {
  namespaced: true,
  state: localState,
  getters,
  actions,
  mutations,
};

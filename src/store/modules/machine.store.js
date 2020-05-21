import moment from 'moment';

import httpClient from '../../api/httpClient';
import { getTotalCountFromHeaders } from '../../api/helper';

import { formatMachine, getTechnicalServiceQuery } from '../../helpers/machine';

const URL = '/machines';

const defaultServicesQuery = {
  dateFrom: moment().startOf('month').format(),
  dateTo: moment().endOf('month').format(),
  onlyTO: false,
};

const initialState = () => ({
  machines: [],
  machine: {},
  machineServices: [],
  servicesTotalCount: 0,
  machineTechnicalServices: [],
  totalCount: 0,
  loading: false,
  query: {
    limit: 10,
    offset: 0,
    active: true,
    search: null,
  },
});

const localState = initialState();

const getters = {
  totalPages(state) {
    return Math.ceil(state.totalCount / state.query.limit);
  },
  machineList(state) {
    return state.machines.slice(0);
  },
  machineServices(state) {
    return state.machineServices.slice(0);
  },
  servicesTotalCount: state => state.servicesTotalCount,
  machine(state) {
    return { ...state.machine };
  },
  isLoading(state) {
    return state.loading;
  },
  technicalList(state) {
    return state.machineTechnicalServices.slice(0).map(formatMachine);
  },
};

const actions = {
  async fetchMachines({ state, commit }, params) {
    if (state.timeout) {
      clearTimeout(state.timeout);
    }

    this.timeout = setTimeout(async () => {
      commit('SET_LOADING', true);
      commit('UPDATE_QUERY', params);

      const response = await httpClient.get(URL, { params: state.query });

      if (response) {
        commit('SET_MACHINES', response);
      }

      commit('SET_LOADING', false);
    }, 300);
  },
  async fetchTechnicalServices({ commit }, year) {
    commit('SET_LOADING', true);

    const response = await httpClient.get(URL, { params: getTechnicalServiceQuery(year) });

    if (response) {
      commit('SET_MACHINE_TECHNICAL_SERVICES', response.data);
    }

    commit('SET_LOADING', false);
  },
  async createMachine({ dispatch }, data) {
    await httpClient.post(URL, data);

    dispatch('fetchMachines');
  },
  async updateMachine({ dispatch }, { id, ...data }) {
    await httpClient.put(`${URL}/${id}`, data);

    dispatch('fetchMachines');
  },
  async removeMachine({ commit }, id) {
    commit('SET_LOADING', true);

    await httpClient.delete(`${URL}/${id}`);

    commit('SET_MACHINE_DATA', {});
    commit('SET_LOADING', false);
  },
  async fetchMachineData({ state, commit }, id) {
    if (id === state.machine.id) {
      return;
    }

    commit('SET_LOADING', true);

    const response = await httpClient.get(`${URL}/${id}`);

    commit('SET_MACHINE_DATA', response.data);
    commit('SET_LOADING', false);
  },
  async fetchMachineServices({ commit }, { id, query }) {
    commit('SET_LOADING', true);
    const params = query || defaultServicesQuery;

    const response = await httpClient.get(`${URL}/${id}/services`, { params });

    commit('SET_MACHINE_SERVICES', response);
    commit('SET_LOADING', false);
  },
  async createMachineService({ dispatch }, { machineId, ...data }) {
    await httpClient.post(`${URL}/${machineId}/services`, data);

    dispatch('fetchMachineServices', { id: machineId });
  },
  async updateMachineService({ dispatch }, { machineId, id, ...data }) {
    await httpClient.put(`${URL}/${machineId}/services/${id}`, data);

    dispatch('fetchMachineServices', { id: machineId });
  },
  async removeMachineService({ dispatch }, { machineId, id }) {
    await httpClient.delete(`${URL}/${machineId}/services/${id}`);

    dispatch('fetchMachineServices', { id: machineId });
  },
  async updateTechnicalService({ dispatch }, { machineId, id, ...data }) {
    await httpClient.put(`${URL}/${machineId}/services/${id}`, data);

    dispatch('fetchTechnicalServices');
  },
};

const mutations = {
  SET_MACHINES(state, response) {
    state.machines = response.data;
    state.totalCount = getTotalCountFromHeaders(response);
  },
  UPDATE_QUERY(state, params) {
    state.query = { ...params };
  },
  SET_LOADING(state, value) {
    state.loading = value;
  },
  SET_MACHINE_DATA(state, payload) {
    state.machine = { ...state.machine, ...payload };
  },
  SET_MACHINE_SERVICES(state, response) {
    state.machineServices = response.data;
    state.servicesTotalCount = getTotalCountFromHeaders(response);
  },
  SET_MACHINE_TECHNICAL_SERVICES(state, payload) {
    state.machineTechnicalServices = payload;
  },
};

export default {
  namespaced: true,
  state: localState,
  getters,
  actions,
  mutations,
};

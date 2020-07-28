
import httpClient from '../../api/httpClient';

const ADMIN_ROLE = 0;
const LOGIN_URL = '/login';
const LOGOUT_URL = '/logout';
const USER_URL = '/user';

const initialState = () => ({
  user: {},
  token: localStorage.getItem('token'),
  loading: false,
});

const localState = initialState();

const getters = {
  isAdmin(state) {
    return state.user.role === ADMIN_ROLE;
  },
  isLoggedIn(state) {
    return !!(state.user.id && state.token);
  },
  isLoading(state) {
    return state.loading;
  },
  token(state) {
    return state.token;
  },
};

const actions = {
  async login({ commit }, data) {
    commit('SET_LOADING', true);

    const response = await httpClient.post(LOGIN_URL, data);

    if (response) {
      commit('SET_TOKEN', response.data.token);
      commit('SET_USER_DATA', response.data.user);
    }

    commit('SET_LOADING', false);
  },
  async logout({ commit }) {
    commit('SET_LOADING', true);

    await httpClient.get(LOGOUT_URL);

    commit('RESET_USER_DATA');
    commit('SET_LOADING', false);
  },
  async getUserData({ state, dispatch, commit }) {
    if (state.user.id) {
      return;
    }

    const response = await httpClient.get(USER_URL);

    if (response) {
      commit('SET_USER_DATA', response.data);
    } else {
      setTimeout(() => dispatch('getUserData'), 200);
    }
  },
};

const mutations = {
  SET_USER_DATA(state, payload) {
    state.user = payload;
  },
  SET_TOKEN(state, payload) {
    const token = `Bearer ${payload}`;
    localStorage.setItem('token', token);
    state.token = token;
  },
  RESET_USER_DATA(state) {
    localStorage.removeItem('token');
    state.user = {};
    state.token = null;
  },
  SET_LOADING(state, payload) {
    state.loading = payload;
  },
};

export default {
  namespaced: true,
  state: localState,
  getters,
  actions,
  mutations,
};

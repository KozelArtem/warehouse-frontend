import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import modules from './modules';
import ERROR_MESSAGES from '../constants/errorMessages';
import { AUTH_NAMESPACE } from './namespaces';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules,
  state: {
    alert: {
      message: '',
      type: 'info',
      show: false,
    },
  },

  mutations: {
    SHOW_ALERT(state, { message, type }) {
      state.alert = {
        message,
        type,
        show: true,
      };
    },
    SHOW_ERROR_ALERT(state, message) {
      state.alert = {
        message,
        type: 'error',
        show: true,
      };
    },
    CLOSE_ALERT(state) {
      state.alert = {
        message: '',
        type: 'info',
        show: false,
      };
    },
  },
  actions: {
    handleError({ commit }, error) {
      switch ((error || {}).status) {
        case 403:
          commit(`${AUTH_NAMESPACE}/RESET_USER_DATA`);
          break;
        case 401: {
          if (error.data.message === 'login') {
            commit('SHOW_ERROR_ALERT', ERROR_MESSAGES.LOGIN_ERROR);
            break;
          }

          commit('SHOW_ERROR_ALERT', ERROR_MESSAGES.PERMISSIONS);
          break;
        }
        default:
          commit('SHOW_ERROR_ALERT', ERROR_MESSAGES.SERVER_ERROR);
          break;
      }
    },
  },
  getters: {
    alert: state => state.alert,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

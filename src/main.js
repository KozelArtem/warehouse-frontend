import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

import { format } from './helpers/dates';
import translate from './helpers/translate';
import store from './store';

Vue.config.productionTip = false;

Vue.filter('date', format);
Vue.filter('translate', translate);

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app');

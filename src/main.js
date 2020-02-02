import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

import { format } from './helpers/dates';

Vue.config.productionTip = false;

Vue.filter('date', format);

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');

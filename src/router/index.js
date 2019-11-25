import Vue from 'vue';
import VueRouter from 'vue-router';

import api from '../api';

import WarehouseTree from '../views/WarehouseTree.vue';
import OrderListTable from '../views/OrderListTable.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'orderList',
    component: OrderListTable,
  },
  {
    path: '/warehouse',
    name: 'warehouse',
    component: WarehouseTree,
  },
  {
    path: '/waybill',
    name: 'waybill',
    component: () => import('../components/auth/SignInForm.vue'),
  },
  {
    path: '/company',
    name: 'company',
    component: () => import('../components/company/CompanyList.vue'),
  },
  {
    path: '/distribution',
    name: 'distributionPlaces',
    component: () => import('../components/distribution/DistributionList.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/auth/SignInForm.vue'),
  },

];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();

    return;
  }
  if (api.isLoggedIn()) {
    next();

    return;
  }

  next('/login');
});


export default router;

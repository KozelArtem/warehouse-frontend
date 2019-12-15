import Vue from 'vue';
import VueRouter from 'vue-router';

import api from '../api';

import OrderListTable from '../views/OrderListTable.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'orderList',
    meta: { title: 'Заказы' },
    component: OrderListTable,
  },
  {
    path: '/warehouse',
    name: 'warehouse',
    meta: { title: 'Склад' },
    component: () => import('../views/WarehouseTree.vue'),
  },
  {
    path: '/waybill',
    name: 'waybill',
    meta: { title: 'Накладные' },
    component: () => import('../components/waybill/WaybillList.vue'),
  },
  {
    path: '/company',
    name: 'company',
    meta: { title: 'Компании' },
    component: () => import('../components/company/CompanyList.vue'),
  },
  {
    path: '/distribution',
    name: 'distributionPlaces',
    meta: { title: 'Журнал' },
    component: () => import('../components/distribution/DistributionList.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: 'Авторизация' },
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

router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = `MPP | ${to.meta.title ? to.meta.title : ''}`;
  });
});

export default router;

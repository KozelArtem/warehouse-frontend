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
    props: { categoryId: 71 },
    component: () => import('../views/WarehouseTree.vue'),
  },
  {
    path: '/tools',
    name: 'tools',
    meta: { title: 'Инструменты' },
    props: { categoryId: 2 },
    component: () => import('../views/WarehouseTree.vue'),
  },
  {
    path: '/equipments',
    name: 'equipments',
    meta: { title: 'Оборудование и техника' },
    props: { categoryId: 25 },
    component: () => import('../views/WarehouseTree.vue'),
  },
  {
    path: '/waybill',
    name: 'waybillList',
    meta: { title: 'Накладные' },
    component: () => import('../components/waybill/WaybillList.vue'),
    children: [
      {
        path: ':id',
        name: 'waybillInfo',
        meta: { title: 'Накладные' },
        component: () => import('../components/waybill/WaybillInfo.vue'),
        props: true,
      },
    ],
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
    path: '/distribution/to',
    name: 'distributionTO',
    meta: { title: 'Журнал' },
    component: () => import('../components/distribution/TechnicalServiceList.vue'),
  },
  {
    path: '/distribution/:id',
    name: 'distPlaceInfo',
    component: () => import('../components/distribution/DistributionItem.vue'),
    props: true,
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

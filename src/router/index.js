import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'orderList',
    meta: { title: 'Заказы' },
    component: () => import('../views/OrderListTable.vue'),
  },
  {
    path: '/warehouse',
    name: 'warehouse',
    meta: { title: 'Склад' },
    props: { categoryId: 71 },
    component: () => import('../components/warehouse/WarehouseCategory.vue'),
  },
  {
    path: '/tools',
    name: 'tools',
    meta: { title: 'Инструменты' },
    props: { categoryId: 2 },
    component: () => import('../components/warehouse/WarehouseCategory.vue'),
  },
  {
    path: '/equipments',
    name: 'equipments',
    meta: { title: 'Оборудование и техника' },
    props: { categoryId: 25 },
    component: () => import('../components/warehouse/WarehouseCategory.vue'),
  },
  {
    path: '/categories/:categoryId',
    name: 'categoryView',
    component: () => import('../components/warehouse/WarehouseCategory.vue'),
    props: true,
  },
  {
    path: '/items/:itemId',
    name: 'itemView',
    component: () => import('../components/item/ItemDetails.vue'),
    props: true,
  },
  {
    path: '/waybill',
    name: 'waybillList',
    meta: { title: 'Накладные' },
    component: () => import('../components/waybill/WaybillList.vue'),
    children: [
      {
        path: 'add',
        name: 'waybillForm',
        meta: { title: 'Накладные' },
        component: () => import('../components/waybill/WaybillForm.vue'),
        props: true,
      },
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
    path: '/machines',
    name: 'machinesList',
    meta: { title: 'Журнал' },
    component: () => import('../components/machine/MachineList.vue'),
  },
  {
    path: '/machines/to',
    name: 'machinesTO',
    meta: { title: 'Журнал' },
    component: () => import('../components/machine/TechnicalServiceList.vue'),
  },
  {
    path: '/machines/:id',
    name: 'machineInfo',
    component: () => import('../components/machine/MachineInfo.vue'),
    props: true,
  },
  {
    path: '/repairItems',
    name: 'repairItemsList',
    meta: { title: 'Валы на реставрацию' },
    component: () => import('../components/repairItem/RepairItemList.vue'),
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

router.beforeEach(async (to, from, next) => {
  await store.dispatch('Auth/getUserData');

  if (to.path === '/login') {
    next();

    return;
  }

  if (store.getters['Auth/isLoggedIn']) {
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

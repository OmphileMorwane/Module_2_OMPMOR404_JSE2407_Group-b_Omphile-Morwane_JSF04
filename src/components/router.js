import { createRouter, createWebHistory } from 'vue-router';
import ProductList from '../components/ProductList.vue';
import ProductDetail from '../components/ProductDetail.vue';

/**
 * Array of route definitions.
 * @type {Array<Object>}
 */
const routes = [
  {
    path: '/',
    name: 'ProductList',
    component: ProductList,
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true, // Allows passing route params as props
  },
];


/**
 * Creates a new Vue Router instance.
 * @returns {Router} The Vue Router instance.
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

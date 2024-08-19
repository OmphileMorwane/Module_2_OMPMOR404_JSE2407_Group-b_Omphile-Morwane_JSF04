import { createRouter, createWebHistory } from "vue-router";
import store from "../components/store"; 
import ProductList from "../components/ProductList.vue";
import ProductDetail from "../components/ProductDetail.vue";
import Login from "../components/Login.vue";
import Cart from "./cart.vue";

/**
 * Array of route definitions.
 * @type {Array<Object>}
 */
const routes = [
  {
    path: "/",
    name: "ProductList",
    component: ProductList,
  },
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: ProductDetail,
    props: true, // Allows passing route params as props
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
    beforeEnter: (to, from, next) => {
      if (!store.state.isAuthenticated) {
        next({ name: "Login", query: { redirect: to.fullPath } });
      } else {
        next();
      }
    },
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

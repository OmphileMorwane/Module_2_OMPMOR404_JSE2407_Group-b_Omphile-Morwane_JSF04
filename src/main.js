import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./components/router";
import store from "./components/store";
import "@fortawesome/fontawesome-free/css/all.min.css";

/**
 * Creates and mounts the Vue application.
 */
const app = createApp(App);

// Restore cart from localStorage if it exists
const savedCart = JSON.parse(localStorage.getItem("cart"));
if (savedCart) {
  savedCart.forEach((item) => store.dispatch("addToCart", item));
}

// Restore wishlist from localStorage if it exists
const savedWishlist = JSON.parse(localStorage.getItem("wishlist"));
if (savedWishlist) {
  store.dispatch("addToWishlist", savedWishlist);
}

/**
 * Uses the Vue Router for the application.
 */
app.use(router);

/**
 * Uses the Vue store for the application.
 */
app.use(store);

/**
 * Dispatches the initializeAuth action to handle authentication state and cart initialization.
 */
store.dispatch("initializeAuth").then(() => {
  // Mount the Vue application to the DOM element with the id 'app'
  app.mount("#app");
});

<template>
  <header class="header">
    <nav class="nav">
      <div class="nav-container">
        <RouterLink to="/" class="logo">
          <img
            src="/src/assets/online-shop.png"
            class="logo-img"
            alt="SwiftCart Logo"
          />
          <span class="logo-text">SwiftCart</span>
        </RouterLink>
        <button
          @click="toggleNavbar"
          type="button"
          class="menu-button"
          aria-controls="navbar-dropdown"
          aria-expanded="navbarOpen"
        >
          <svg
            class="menu-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          :class="{ hidden: !navbarOpen, block: navbarOpen }"
          class="navbar-dropdown"
          id="navbar-dropdown"
        >
          <ul class="navbar-list">
            <!-- Conditional rendering for cart and wishlist -->
            <li>
              <RouterLink
                to="/wishlist"
                class="navbar-item"
                @click.prevent="redirectToLoginIfNotAuthenticated('/wishlist')"
              >
                <div class="wishlist-notification">
                  <p class="wishlist-count">{{ wishlistItemCount }}</p>
                </div>
                Wishlist
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/cart"
                class="navbar-item"
                @click.prevent="redirectToLoginIfNotAuthenticated('/cart')"
              >
                <div class="cart-notification">
                  <p class="cart-count">{{ cartItemCount }}</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="cart-icon"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/comparison"
                class="navbar-item"
                @click.prevent="
                  redirectToLoginIfNotAuthenticated('/comparison')
                "
              >
                <div class="compare-notification">
                  <p class="compare-count">{{ comparisonCount }}</p>
                </div>
                Compare Products
              </RouterLink>
            </li>
          </ul>
        </div>
        <li class="login">
          <!-- Show login or logout based on authentication status -->
          <button
            @click="isAuthenticated ? logout() : redirectToLogin()"
            class="navbar-item"
          >
            {{ isAuthenticated ? "Logout" : "Login" }}
          </button>
        </li>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

/**
 * A reactive reference that indicates whether the navbar is open or closed.
 * @type {Ref<boolean>}
 */
const navbarOpen = ref(false);

/**
 * The Vuex store instance used to access state and dispatch actions.
 * @type {Store}
 */
const store = useStore();

/**
 * The Vue Router instance used to navigate programmatically.
 * @type {Router}
 */
const router = useRouter();

/**
 * A computed property that returns the authentication status of the user.
 * @type {ComputedRef<boolean>}
 */
const isAuthenticated = computed(() => store.state.isAuthenticated);

/**
 * A computed property that returns the number of items in the cart.
 * @type {ComputedRef<number>}
 */
const cartItemCount = computed(() => store.getters.cartItemCount);

/**
 * A computed property that returns the number of items in the wishlist.
 * @type {ComputedRef<number>}
 */
const wishlistItemCount = computed(() => store.getters.wishlistItemCount);

/**
 * A computed property that returns the number of items in the comparison list.
 * @type {ComputedRef<number>}
 */
const comparisonCount = computed(() => store.getters.comparisonListCount);

/**
 * Toggles the visibility of the navbar.
 */
function toggleNavbar() {
  navbarOpen.value = !navbarOpen.value;
}

/**
 * Logs out the user and redirects them to the home page.
 */
function logout() {
  store.dispatch("logout");
  router.push("/");
}

/**
 * Redirects the user to the login page.
 */
function redirectToLogin() {
  router.push("/login");
}

/**
 * Redirects the user to the login page if they are not authenticated.
 * Otherwise, redirects them to the specified destination.
 * @param {string} destination - The path to redirect to if authenticated.
 */
function redirectToLoginIfNotAuthenticated(destination) {
  if (!isAuthenticated.value) {
    router.push({ path: "/login", query: { redirect: destination } });
  } else {
    router.push(destination);
  }
}
</script>

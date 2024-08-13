<template>
  <header class="header">
    <nav class="nav">
      <div class="nav-container">
        <a href="/" class="logo">
          <img
            src="/src/assets/online-shop.png"
            class="logo-img"
            alt="Flowbite Logo"
          />
          <span class="logo-text">SwiftCart</span>
        </a>
        <button
          @click="toggleNavbar"
          type="button"
          class="menu-button"
          aria-controls="navbar-dropdown"
          aria-expanded="false"
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
            <li>
              <a href="#" class="navbar-item">Wishlist</a>
            </li>
            <li class="navbar-cart">
              <a href="#" class="navbar-item">
                <div class="cart-notification">
                  <p class="cart-count">2</p>
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
              </a>
            </li>
            <li>
              <a href="#" class="navbar-item cart-mobile">Cart</a>
            </li>
            <li>
              <a href="login" class="navbar-item">Login</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const navbarOpen = ref(false);

/**
 * Toggles the visibility of the navbar.
 * @returns {void}
 */
function toggleNavbar() {
  navbarOpen.value = !navbarOpen.value;
  console.log("Navbar Open:", navbarOpen.value);
}

</script>


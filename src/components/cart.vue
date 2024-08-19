<template>
        <div class="cart-container">
          <h2>Your Shopping Cart</h2>
          <ul>
            <li v-for="item in cartItems" :key="item.id" class="cart-item">
              <div>{{ item.title }}</div>
              <div>
                <button @click="decreaseQuantity(item.id)">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increaseQuantity(item.id)">+</button>
              </div>
              <div>{{ item.price }}</div>
              <button @click="removeItem(item.id)">Remove</button>
            </li>
          </ul>
          <div class="cart-summary">
            <p>Total Items: {{ cartItemCount }}</p>
            <p>Total Cost: ${{ cartTotalCost }}</p>
          </div>
          <button @click="clearCart">Clear Cart</button>
        </div>
      </template>
      
      <script setup>
      import { computed } from 'vue';
      import { useStore } from 'vuex';
      
      const store = useStore();
      const cartItems = computed(() => store.getters.cartItems);
      const cartItemCount = computed(() => store.getters.cartItemCount);
      const cartTotalCost = computed(() => store.getters.cartTotalCost);
      
      const removeItem = (itemId) => {
        store.dispatch('removeFromCart', itemId);
      };
      
      const increaseQuantity = (itemId) => {
        const item = cartItems.value.find(item => item.id === itemId);
        store.dispatch('updateCartQuantity', { itemId, quantity: item.quantity + 1 });
      };
      
      const decreaseQuantity = (itemId) => {
        const item = cartItems.value.find(item => item.id === itemId);
        if (item.quantity > 1) {
          store.dispatch('updateCartQuantity', { itemId, quantity: item.quantity - 1 });
        }
      };
      
      const clearCart = () => {
        store.dispatch('clearCart');
      };
      </script>
      
      
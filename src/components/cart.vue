<template>
  <div class="cart-container">
    <h2>Your Shopping Cart</h2>

    <div v-if="cartItems.length === 0" class="empty-cart">
      <img src="/src/assets/empty cart.png" alt="Empty Cart" class="empty-cart-image" />
      <p>Your cart is empty</p>
    </div>

    <ul v-else class="cart-items-list">
      <li v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.image" alt="Product Image" class="cart-item-image" />
        <div class="cart-item-details">
          <div class="cart-item-title">{{ item.title }}</div>
          <div class="cart-item-quantity">
            <button @click="decreaseQuantity(item.id)" class="quantity-button">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQuantity(item.id)" class="quantity-button">+</button>
          </div>
          <div class="cart-item-price">${{ item.price }}</div>
          <button @click="removeItem(item.id)" class="remove-button">Remove</button>
        </div>
      </li>
    </ul>

    <div v-if="cartItems.length > 0" class="cart-summary">
      <p>Total Items: {{ cartItemCount }}</p>
      <p>Total Cost: ${{ cartTotalCost }}</p>
      <button @click="clearCart" class="clear-cart-button">Clear Cart</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

/**
 * Provides access to Vuex store.
 */
const store = useStore();

/**
 * Computed property for cart items.
 * @returns {Array} List of cart items.
 */
const cartItems = computed(() => store.getters.cartItems);

/**
 * Computed property for total number of cart items.
 * @returns {Number} Total number of items in the cart.
 */
const cartItemCount = computed(() => store.getters.cartItemCount);

/**
 * Computed property for the total cost of items in the cart.
 * @returns {String} Total cost formatted as a string.
 */
const cartTotalCost = computed(() => store.getters.cartTotalCost);

/**
 * Removes an item from the cart.
 * @param {Number} itemId - The ID of the item to remove.
 */
const removeItem = (itemId) => {
  store.dispatch("removeFromCart", itemId);
};

/**
 * Increases the quantity of a specific item in the cart.
 * @param {Number} itemId - The ID of the item to update.
 */
const increaseQuantity = (itemId) => {
  const item = cartItems.value.find((item) => item.id === itemId);
  store.dispatch("updateCartQuantity", { itemId, quantity: item.quantity + 1 });
};

/**
 * Decreases the quantity of a specific item in the cart.
 * @param {Number} itemId - The ID of the item to update.
 */
const decreaseQuantity = (itemId) => {
  const item = cartItems.value.find((item) => item.id === itemId);
  if (item.quantity > 1) {
    store.dispatch("updateCartQuantity", {
      itemId,
      quantity: item.quantity - 1,
    });
  }
};

/**
 * Clears all items from the cart.
 */
const clearCart = () => {
  store.dispatch("clearCart");
};
</script>

<style scoped>
.cart-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.empty-cart {
  text-align: center;
  padding: 20px;
}

.empty-cart-image {
  width: 150px;
  margin-bottom: 20px;
}

.cart-items-list {
  list-style-type: none;
  padding: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 20px;
}

.cart-item-details {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cart-item-title {
  flex-grow: 2;
  font-size: 16px;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
}

.quantity-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
}

.quantity-button:hover {
  background-color: #0056b3;
}

.cart-item-price {
  font-weight: bold;
  margin-left: 20px;
}

.remove-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #c82333;
}

.cart-summary {
  margin-top: 20px;
  text-align: right;
}

.clear-cart-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin: 20px auto;
}

.clear-cart-button:hover {
  background-color: #c82333;
}
</style>

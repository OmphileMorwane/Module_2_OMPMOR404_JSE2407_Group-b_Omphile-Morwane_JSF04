<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.title" class="product-image" />
    <h2 class="product-title">{{ product.title }}</h2>
    <p class="product-price">${{ product.price }}</p>
    <p class="product-category">{{ product.category }}</p>
    <div class="product-rating">
      <!-- Render filled stars -->
      <template v-for="index in totalStars">
        <svg
          v-if="index <= filledStarsCount"
          :key="'filled-' + index"
          class="rating-star"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path
            d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
          />
        </svg>
        <template v-else>
          <!-- Render empty stars -->
          <svg
            v-if="index > filledStarsCount"
            :key="'empty-' + index"
            class="rating-star empty"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path
              d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
            />
          </svg>
        </template>
      </template>
    </div>
    <div class="actions">
      <button class="add-to-cart" @click="addToCart">Add to Cart</button>
      <router-link :to="`/product/${product.id}`" class="product-link">
        <button class="view-item" @click="viewItem">View Item</button>
      </router-link>
      <svg
        class="heart-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
import { useStore } from "vuex";

/**
 * Props definition for the ProductCard component.
 * @typedef {Object} Product
 * @property {number} id - The unique identifier of the product.
 * @property {string} image - The URL of the product image.
 * @property {string} title - The title of the product.
 * @property {number} price - The price of the product.
 * @property {string} category - The category of the product.
 * @property {Object} rating - The rating of the product.
 * @property {number} rating.rate - The rating value of the product.
 *
 * @type {import('vue').PropsDefinition<{ product: Product }>}
 */
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const store = useStore();

// Total number of stars for the rating
const totalStars = 5;

/**
 * Computes the number of filled stars based on the product's rating.
 * @type {import('vue').ComputedRef<number>}
 */
const filledStarsCount = computed(() => Math.round(props.product.rating.rate));

/**
 * Computes the number of empty stars based on the total stars and filled stars.
 * @type {import('vue').ComputedRef<number>}
 */
const emptyStarsCount = computed(() => totalStars - filledStarsCount.value);

/**
 * Handles the action of adding the product to the cart.
 * Logs a message to the console for now. This should be replaced with actual cart logic.
 */
const addToCart = () => {
  if (store.state.isAuthenticated) {
    store.dispatch("addToCart", { ...props.product, quantity: 1 }); // Dispatch Vuex action to add item to cart
  } else {
    console.log("Please log in to add items to the cart.");
  }
};
</script>

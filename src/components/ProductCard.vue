<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.title" class="product-image" />
    <h2 class="product-title">{{ product.title }}</h2>
    <p class="product-price">${{ product.price }}</p>
    <p class="product-category">{{ product.category }}</p>

    <div class="product-rating">
      <!-- Render filled stars -->
      <template v-for="index in totalStars" :key="'star-' + index">
        <svg
          v-if="index <= filledStarsCount"
          class="rating-star"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path
            d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
          />
        </svg>
        <svg
          v-else
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
    </div>

    <div class="actions">
      <button @click="addToCart" :disabled="isAddedToCart">
        {{ isAddedToCart ? "Added to Cart" : "Add to Cart" }}
      </button>
      <router-link :to="`/product/${product.id}`" class="product-link">
        <button class="view-item">View Item</button>
      </router-link>
      <div class="wishlist-icon" @click="toggleWishlist(product)">
        <svg
          class="heart-icon"
          :class="{ active: isInWishlist }"
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
    <button @click="addToCompare" class="actions">Compare</button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

// Props definition
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const store = useStore();

// Compute if the product is added to the cart
const isAddedToCart = computed(() => {
  return store.state.cart.some(
    (item) => item.id === props.product.id && item.userId === store.state.userId
  );
});

// Total number of stars for the rating
const totalStars = 5;
const filledStarsCount = computed(() => Math.round(props.product.rating.rate));

// Add to cart functionality
const addToCart = () => {
  if (!isAddedToCart.value && store.state.isAuthenticated) {
    store.dispatch("addToCart", { ...props.product, quantity: 1 });
  }
};

// Wishlist management
// Check if the product is in the wishlist
const isInWishlist = computed(() =>
  store.getters.isProductInWishlist(props.product.id)
);

// Toggle the wishlist state
function toggleWishlist(product) {
  if (isInWishlist.value) {
    store.dispatch("removeFromWishlist", product.id);
  } else {
    store.dispatch("addToWishlist", product);
  }
}

// Comparison functionality
const addToCompare = () => {
  store
    .dispatch("addToComparison", props.product)
    .then(() => console.log("Product added to compare list"))
    .catch((error) =>
      console.error("Failed to add product to compare list:", error)
    );
};
</script>

<style scoped>
button[disabled] {
  background-color: grey;
  cursor: not-allowed;
}
</style>

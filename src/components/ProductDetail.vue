<template>
  <main>
    <!-- Skeleton loader -->
    <div v-if="loading" class="skeleton-container">
      <div class="skeleton-image"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-description"></div>
      <div class="skeleton-price"></div>
      <div class="skeleton-category"></div>
      <div class="skeleton-rating"></div>
    </div>
    <!-- Actual content -->
    <div v-else-if="product" class="product-detail">
      <img :src="product.image" :alt="product.title" class="image" />
      <h1>{{ product.title }}</h1>
      <p>{{ product.description }}</p>
      <p class="price">${{ product.price }}</p>
      <p class="product-category">{{ product.category }}</p>
      <div class="rating-reviews">
        <div class="rating">
          <span class="rating-icon">⭐</span>
          <span class="rating-value">{{ product.rating.rate }}</span>
        </div>
        <div class="reviews">
          <span class="reviews-label">Number of Reviews:</span>
          <span class="reviews-value">{{ product.rating.count }}</span>
        </div>
      </div>
      <!-- Added to Wishlist Button -->
      <svg
        class="heart-icon"
        :class="{ active: isInWishlist }"
        @click="toggleWishlist"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
      <div class="back-link">
        <router-link class="back-link-anchor" to="/"
          >Back to products</router-link
        >
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { fetchProduct } from "./api";

const product = ref(null);
const loading = ref(true);
const route = useRoute();
const store = useStore();

// Load product details
const loadProduct = async () => {
  const id = route.params.id;
  try {
    product.value = await fetchProduct(id);
  } catch (error) {
    console.error("Error fetching product:", error);
  } finally {
    loading.value = false;
  }
};

// Check if product is in wishlist
const isInWishlist = computed(() => {
  return product.value
    ? store.getters.isProductInWishlist(product.value.id)
    : false;
});

// Toggle wishlist state
const toggleWishlist = () => {
  if (product.value) {
    if (isInWishlist.value) {
      store.dispatch("removeFromWishlist", product.value.id);
    } else {
      store.dispatch("addToWishlist", product.value);
    }
  }
};

onMounted(() => {
  loadProduct();
});
</script>

<style scoped>
/* Your CSS styling here */
</style>

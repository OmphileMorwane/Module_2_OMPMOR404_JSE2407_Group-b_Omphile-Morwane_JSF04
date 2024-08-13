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
    <!--Actual content-->

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
      <div class="back-link">
        <router-link class="back-link-anchor" to="/">Back to products</router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchProduct } from "./api";

/**
 * Reactive reference to store the product details.
 * @type {Object|null}
 */
const product = ref(null);

/**
 * Reactive reference to manage loading state.
 * @type {boolean}
 */
const loading = ref(true);

/**
 * Vue Router's useRoute function to get the current route object.
 * @type {Object}
 */
const route = useRoute();

/**
 * Asynchronous function to load product details from the API.
 * It fetches the product data based on the product ID from the route parameters.
 * @returns {Promise<void>}
 */
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

/**
 * Lifecycle hook that runs when the component is mounted.
 * It calls the loadProduct function to fetch and display the product details.
 */
onMounted(() => {
  loadProduct();
});
</script>


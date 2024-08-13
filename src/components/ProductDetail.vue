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

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.skeleton-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  background-color: white;
}

.skeleton-image,
.skeleton-title,
.skeleton-description,
.skeleton-price,
.skeleton-category,
.skeleton-rating {
  background-color: #aca8a8;
  margin: 10px 0;
  border-radius: 4px;
}

.skeleton-image {
  width: 100%;
  height: 200px;
}

.skeleton-title {
  width: 80%;
  height: 24px;
}

.skeleton-description {
  width: 90%;
  height: 16px;
}

.skeleton-price {
  width: 50%;
  height: 20px;
}

.skeleton-category {
  width: 60%;
  height: 16px;
}

.skeleton-rating {
  width: 70%;
  height: 16px;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.skeleton-container > * {
  animation: pulse 1.5s infinite ease-in-out;
}

.product-detail {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  background: rgba(255, 255, 255, 0.9); /* Transparent background */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative; /* Position relative for positioning the link */
}

.product-detail img {
  width: 60%;
  height: auto;
  border-radius: 1px;
  max-height: 200px; /* Maximum height for the image */
  object-fit: contain;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1c1717;
}

.rating-reviews {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}

.rating {
  display: flex;
  align-items: center;
  margin-right: 20px; /* Space between rating and reviews */
}

.rating-icon {
  font-size: 1.5rem; 
  color: #ffd902; /* Star color */
  margin-right: 0.5rem;
}

.rating-value {
  font-size: 1rem;
  color: #333;
  font-weight: bold;
}

.reviews {
  display: flex;
  align-items: center;
}

.reviews-label {
  font-size: 1rem;
  color: #333;
  margin-right: 0.5rem;
  font-weight: bold;
}

.reviews-value {
  font-size: 1rem;
  color: #333;
  font-weight: bold;
}

.back-link {
  display: block;
  padding: 10px 20px;
  color: #eef1f3;
  font-weight: bold;
  border: 3px solid #070707;
  border-radius: 30px;
  background: rgb(16, 128, 114);
  transition: 0.3s, color 0.3s;
  position: absolute;
  bottom: 88%; /* Position the link at the bottom of the box */
  left: 90%;
  transform: translateX(-50%);
  text-decoration: none;
}

.back-link-anchor {
  text-decoration: none; /* Remove underline */
  color: inherit; /* Ensure text color matches parent */
}

.back-link:hover {
  background: rgb(202, 240, 238); /* Light grey background on hover */
  color:rgb(9, 99, 96);
}

.product-category {
  display: inline-block;
  background-color: #e0f7fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
</style>

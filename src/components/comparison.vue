<template>
  <div class="comparison-page">
    <h1>Compare Products</h1>

    <!-- Display the comparison table if there are products to compare -->
    <table v-if="comparisonList.length > 0">
      <thead>
        <tr>
          <!-- Empty cell for header row -->
          <td></td>
          <th v-for="product in comparisonList" :key="'header-' + product.id">
            {{ product.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Image</td>
          <td v-for="product in comparisonList" :key="'img-' + product.id">
            <img :src="product.image" :alt="product.title" />
          </td>
        </tr>
        <tr>
          <td>Description</td>
          <td v-for="product in comparisonList" :key="'desc-' + product.id">
            {{ product.description || "No description" }}
          </td>
        </tr>
        <tr>
          <td>Price</td>
          <td v-for="product in comparisonList" :key="'price-' + product.id">
            ${{ product.price }}
          </td>
        </tr>
        <tr>
          <td>Rating</td>
          <td v-for="product in comparisonList" :key="'rating-' + product.id">
            {{ product.rating.rate || "No rating" }}
          </td>
        </tr>
        <tr>
          <td>Actions</td>
          <td v-for="product in comparisonList" :key="'remove-' + product.id">
            <button @click="removeFromComparison(product.id)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Button to clear the comparison list -->
    <button v-if="comparisonList.length > 0" @click="clearComparisonList">
      Clear Comparison List
    </button>
    <p v-else>No products in the comparison list</p>
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
 * Computed property for the list of products being compared.
 * @returns {Array} List of products in the comparison list.
 */
const comparisonList = computed(() => store.getters.comparisonList);

/**
 * Removes a product from the comparison list.
 * @param {Number} productId - The ID of the product to remove.
 */
const removeFromComparison = (productId) => {
  store.dispatch("removeFromComparison", productId);
};

/**
 * Clears all products from the comparison list.
 */
const clearComparisonList = () => {
  store.dispatch("clearComparisonList");
};
</script>

<style scoped>
/* Basic table styling */
.comparison-page {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

img {
  max-width: 100px;
  height: auto;
}

button {
  cursor: pointer;
}

/* Align table cells */
td:first-child {
  text-align: left;
}
</style>

<template>
  <div>
    <div class="controls">
      <div class="control">
        <label for="category">Filter by Category:</label>
        <select
          id="category"
          v-model="selectedCategory"
          @change="filterByCategory"
        >
          <option value="">All</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

      <div class="control">
        <label for="sortOrder">Sort by Price:</label>
        <select id="sortOrder" v-model="sortOrder" @change="sortProducts">
          <option value="">Default</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading"></div>
    <div v-else class="product-section">
      <div class="product-grid">
        <ProductCard
          v-for="product in filteredAndSortedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>

  <div v-if="loading" class="skeleton-grid">
    <div class="skeleton-card" v-for="n in 6" :key="n">
      <div class="skeleton-image"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-description"></div>
      <div class="skeleton-price"></div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import ProductCard from "./ProductCard.vue";

export default {
  name: "ProductList",
  components: {
    ProductCard,
  },

  /**
   * The setup function initializes the component's reactive data properties and methods.
   * @returns {Object} The reactive data properties and methods for the component.
   */
  setup() {
    const store = useStore();
    
    // Reactive computed properties for categories, loading state, selected category, and sort order.
    /**
     * Computed property for product categories from the Vuex store.
     * @type {ComputedRef<string[]>}
     */
    const categories = computed(() => store.state.categories);

    /**
     * Computed property for loading state from the Vuex store.
     * @type {ComputedRef<boolean>}
     */
    const loading = computed(() => store.state.loading);

    /**
     * Computed property for the selected category, with getter and setter for Vuex state.
     * @type {ComputedRef<string>}
     */
    const selectedCategory = computed({
      get: () => store.state.selectedCategory,
      set: (value) => store.commit("setSelectedCategory", value),
    });

    /**
     * Computed property for the sort order, with getter and setter for Vuex state.
     * @type {ComputedRef<string>}
     */
    const sortOrder = computed({
      get: () => store.state.sortOrder,
      set: (value) => store.commit("setSortOrder", value),
    });

    /**
     * Computed property for filtered and sorted products from the Vuex store.
     * @type {ComputedRef<Product[]>}
     */
    const filteredAndSortedProducts = computed(
      () => store.getters.filteredAndSortedProducts
    );

    /**
     * Function to filter products based on the selected category.
     * This function is triggered when the category dropdown value changes.
     */
    const filterByCategory = () => {
      // No need to update the state here as v-model does that
    };

    /**
     * Function to sort products based on the selected sort order.
     * This function is triggered when the sort order dropdown value changes.
     */
    const sortProducts = () => {
      // No need to update the state here as v-model does that
    };

    /**
     * Lifecycle hook that runs when the component is mounted.
     * Loads products and categories from the Vuex store.
     */
    onMounted(() => {
      store.dispatch("loadProducts");
      store.dispatch("loadCategories");
    });

    return {
      categories,
      loading,
      selectedCategory,
      sortOrder,
      filteredAndSortedProducts,
      filterByCategory,
      sortProducts,
    };
  },
};
</script>

<style scoped>
.controls {
  display: flex;
  gap: 200px;
  margin-left: 200px;
}

.loading {
  text-align: center;
  margin-top: 20px;
}

.skeleton-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: space-evenly;
  margin-top: 50px;
}

.skeleton-card {
  background: #e0e0e0;
  border-radius: 8px;
  width: 200px;
  height: 300px;
  padding: 10px;
}

.skeleton-image {
  background: #c0c0c0;
  width: 100%;
  height: 150px;
  border-radius: 4px;
}

.skeleton-title {
  background: #d0d0d0;
  width: 80%;
  height: 20px;
  margin: 10px 0;
  border-radius: 4px;
}

.skeleton-description {
  background: #d0d0d0;
  width: 60%;
  height: 16px;
  margin: 5px 0;
  border-radius: 4px;
}

.skeleton-price {
  background: #d0d0d0;
  width: 50%;
  height: 20px;
  margin-top: 10px;
  border-radius: 4px;
}

.product-section {
  margin-top: 20px;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: space-evenly;
  margin-top: 50px;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    gap: 20px;
    margin-left: 90px;
    align-items: center;
    font-size: small;
  }

  .control {
    flex-direction: column;
    gap: 8px;
    width: 140%;
    text-align: center;
    font-size: small;
    margin-left: -100px;
  }

  .sort-control {
    align-items: center;
    justify-content: center;
    display: flex;
    height: 20%;
  }

  .sort-control label,
  .sort-control select {
    margin: 0 auto;
  }
}
</style>

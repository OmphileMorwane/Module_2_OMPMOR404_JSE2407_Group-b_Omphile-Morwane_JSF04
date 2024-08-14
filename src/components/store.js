import { createStore } from 'vuex';
import { fetchProducts, fetchCategories } from './api';

export default createStore({
  state: {
    products: [],
    categories: [],
    selectedCategory: '',
    sortOrder: '',
    loading: true,
    error: null,
    theme: localStorage.getItem('theme') || 'light', // Load theme from localStorage or default to 'light'
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setSelectedCategory(state, category) {
      state.selectedCategory = category;
    },
    setSortOrder(state, order) {
      state.sortOrder = order;
    },
    setLoading(state, isLoading) {
      state.loading = isLoading;
    },
    setError(state, error) {
      state.error = error;
    },

    setTheme(state, newTheme) { // Updated mutation to set theme
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme); // Save the theme to localStorage
  },

},
  actions: {
    async loadProducts({ commit }) {
      try {
        const products = await fetchProducts();
        commit('setProducts', products);
      } catch (error) {
        commit('setError', error.message);
        console.error('Error fetching products:', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async loadCategories({ commit }) {
      try {
        const categories = await fetchCategories();
        commit('setCategories', categories);
      } catch (error) {
        commit('setError', error.message);
        console.error('Error fetching categories:', error);
      }
    },

    toggleTheme({ commit, state }) {
      const newTheme = state.theme === "light" ? "dark" : "light";
      commit("setTheme", newTheme);
    },
  },
  getters: {
    filteredAndSortedProducts(state) {
      let result = [...state.products];

      if (state.selectedCategory) {
        result = result.filter(
          (product) => product.category === state.selectedCategory
        );
      }

      if (state.sortOrder === 'asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (state.sortOrder === 'desc') {
        result.sort((a, b) => b.price - a.price);
      }

      return result;
    },

    // Getter to retrieve the current theme
    theme(state) {
      return state.theme;
    },
  },
});
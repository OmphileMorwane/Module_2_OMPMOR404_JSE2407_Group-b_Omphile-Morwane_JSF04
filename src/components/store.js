import { createStore } from 'vuex';
import { fetchProducts, fetchCategories, loginUser } from './api';

export default createStore({
  state: {
    products: [],
    categories: [],
    selectedCategory: '',
    sortOrder: '',
    loading: true,
    error: null,
    theme: localStorage.getItem('theme') || 'light', // Load theme from localStorage or default to 'light'
    isAuthenticated: false,
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
    setTheme(state, newTheme) {
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme); // Save the theme to localStorage
    },
    setAuth(state, status) {
      state.isAuthenticated = status;
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
    async login({ commit }, { username, password }) {
      try {
        const data = await loginUser(username, password);
        commit('setAuth', true);
        localStorage.setItem('jwt', data.token); // Store JWT
      } catch (error) {
        console.error('Login failed:', error);
        commit('setError', error.message);
      }
    },
    async logout({ commit }) {
      commit('setAuth', false);
      localStorage.removeItem('jwt'); // Remove JWT on logout
    },
    async checkAuth({ commit }) {
      const token = localStorage.getItem('jwt');
      if (token) {
        try {
          // Optionally verify token with the server
          commit('setAuth', true);
        } catch (error) {
          commit('setAuth', false);
          console.error('Token validation failed:', error);
        }
      } else {
        commit('setAuth', false);
      }
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
    theme(state) {
      return state.theme;
    },
  },
});

import { createStore } from 'vuex';
import { fetchProducts, fetchCategories } from './api';
import { jwtDecode } from 'jwt-decode';

export default createStore({
  state: {
    products: [],
    categories: [],
    selectedCategory: '',
    sortOrder: '',
    loading: true,
    error: null,
    theme: localStorage.getItem('theme') || 'light',
    isAuthenticated: !!localStorage.getItem('jwt'), // Initialize from localStorage
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    userId: null,
    comparisonList: JSON.parse(localStorage.getItem('comparisonList')) || [],
    wishlist: [],
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
      localStorage.setItem('theme', newTheme);
    },
    setAuth(state, status) {
      state.isAuthenticated = status;
      if (!status) {
        state.cart = [];
        state.userId = null;
        localStorage.removeItem('cart');
        localStorage.removeItem('jwt');
      }
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    addToCart(state, item) {
      const existingItem = state.cart.find((product) => product.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cart.push(item);
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeFromCart(state, itemId) {
      state.cart = state.cart.filter((item) => item.id !== itemId);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    updateCartQuantity(state, { itemId, quantity }) {
      const item = state.cart.find((product) => product.id === itemId);
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    clearCart(state) {
      state.cart = [];
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    setCartFromLocalStorage(state) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        state.cart = JSON.parse(storedCart);
      }
    },
    ADD_TO_COMPARISON(state, product) {
      if (state.comparisonList.length < 3) {
        state.comparisonList.push(product);
        localStorage.setItem(
          'comparisonList',
          JSON.stringify(state.comparisonList)
        );
      }
    },
    REMOVE_FROM_COMPARISON(state, productId) {
      state.comparisonList = state.comparisonList.filter(
        (product) => product.id !== productId
      );
      localStorage.setItem(
        'comparisonList',
        JSON.stringify(state.comparisonList)
      );
    },
    CLEAR_COMPARISON_LIST(state) {
      state.comparisonList = [];
      localStorage.setItem(
        'comparisonList',
        JSON.stringify(state.comparisonList)
      );
    },
    addToWishlist(state, product) {
      if (!state.wishlist.find((item) => item.id === product.id)) {
        state.wishlist.push(product);
      }
    },
    removeFromWishlist(state, productId) {
      state.wishlist = state.wishlist.filter((item) => item.id !== productId);
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
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      commit('setTheme', newTheme);
    },
    login({ commit }, token) {
      const decodedToken = jwtDecode(token);
      commit('setAuth', true);
      commit('setUserId', decodedToken.userId);
      localStorage.setItem('jwt', token);
      commit('setCartFromLocalStorage');
    },
    logout({ commit }) {
      commit('setAuth', false);
      commit('clearCart');
      localStorage.removeItem('jwt');
      localStorage.removeItem('cart');
    },
    addToCart({ commit, state }, item) {
      if (!state.isAuthenticated) {
        return; // Prevent adding to cart if not logged in
      }
      commit('addToCart', { ...item, userId: state.userId });
    },
    removeFromCart({ commit }, itemId) {
      commit('removeFromCart', itemId);
    },
    updateCartQuantity({ commit }, { itemId, quantity }) {
      commit('updateCartQuantity', { itemId, quantity });
    },
    clearCart({ commit }) {
      commit('clearCart');
    },
    addToComparison({ commit }, product) {
      commit('ADD_TO_COMPARISON', product);
    },
    removeFromComparison({ commit }, productId) {
      commit('REMOVE_FROM_COMPARISON', productId);
    },
    clearComparisonList({ commit }) {
      commit('CLEAR_COMPARISON_LIST');
    },
    loadComparisonList({ commit }) {
      const storedList = localStorage.getItem('comparisonList');
      if (storedList) {
        const products = JSON.parse(storedList);
        products.forEach((product) => commit('ADD_TO_COMPARISON', product));
      }
    },
    addToWishlist({ commit }, product) {
      commit('addToWishlist', product);
    },
    removeFromWishlist({ commit }, productId) {
      commit('removeFromWishlist', productId);
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
    cartItems(state) {
      return state.cart.filter((item) => item.userId === state.userId);
    },
    cartItemCount(state, getters) {
      return getters.cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
    cartTotalCost(state, getters) {
      return getters.cartItems
        .reduce((total, item) => total + item.quantity * item.price, 0)
        .toFixed(2);
    },
    comparisonList: (state) => state.comparisonList,
    isProductInWishlist: (state) => (productId) => {
      return state.wishlist.some((item) => item.id === productId);
    },
    comparisonListCount(state) {
      return state.comparisonList.length;
    },
  },
});



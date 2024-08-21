import { createStore } from "vuex";
import { fetchProducts, fetchCategories } from "./api";
import { jwtDecode } from "jwt-decode"; // Fixed import for jwt-decode

export default createStore({
  state: {
    products: [],
    categories: [],
    selectedCategory: "",
    sortOrder: "",
    loading: true,
    error: null,
    theme: localStorage.getItem("theme") || "light",
    isAuthenticated: !!localStorage.getItem("jwt"), // Initialize from localStorage
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    userId: null,
    comparisonList: JSON.parse(localStorage.getItem("comparisonList")) || [],
    wishlist: JSON.parse(localStorage.getItem("wishlist")) || [],
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
      localStorage.setItem("theme", newTheme);
    },
    setAuth(state, status) {
      state.isAuthenticated = status;
      if (!status) {
        state.userId = null;
        localStorage.removeItem("jwt");

        // Do not clear cart from localStorage
      }
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    // Cart mutations
    addToCart(state, item) {
      const existingItem = state.cart.find(
        (product) => product.id === item.id && product.userId === state.userId
      );
      if (!existingItem) {
        state.cart.push(item);
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    removeFromCart(state, itemId) {
      state.cart = state.cart.filter((item) => item.id !== itemId);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    updateCartQuantity(state, { itemId, quantity }) {
      const item = state.cart.find((product) => product.id === itemId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    clearCart(state) {
      state.cart = [];
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    setCartFromLocalStorage(state, userCart) {
      state.cart = userCart || [];
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    // Comparison list mutations
    ADD_TO_COMPARISON(state, product) {
      if (state.comparisonList.length < 3) {
        state.comparisonList.push(product);
        localStorage.setItem(
          "comparisonList",
          JSON.stringify(state.comparisonList)
        );
      }
    },
    REMOVE_FROM_COMPARISON(state, productId) {
      state.comparisonList = state.comparisonList.filter(
        (product) => product.id !== productId
      );
      localStorage.setItem(
        "comparisonList",
        JSON.stringify(state.comparisonList)
      );
    },
    CLEAR_COMPARISON_LIST(state) {
      state.comparisonList = [];
      localStorage.setItem(
        "comparisonList",
        JSON.stringify(state.comparisonList)
      );
    },
    // Wishlist mutations
    addToWishlist(state, product) {
      if (Array.isArray(product)) {
        product.forEach((item) => {
          if (
            !state.wishlist.some((wishlistItem) => wishlistItem.id === item.id)
          ) {
            state.wishlist.push(item);
          }
        });
      } else {
        if (!state.wishlist.some((item) => item.id === product.id)) {
          state.wishlist.push(product);
        }
      }
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    },
    removeFromWishlist(state, productId) {
      state.wishlist = state.wishlist.filter((item) => item.id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    },
    clearWishlist(state) {
      state.wishlist = [];
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    },
  },

  actions: {
    async loadProducts({ commit }) {
      try {
        const products = await fetchProducts();
        commit("setProducts", products);
      } catch (error) {
        commit("setError", error.message);
        console.error("Error fetching products:", error);
      } finally {
        commit("setLoading", false);
      }
    },
    async loadCategories({ commit }) {
      try {
        const categories = await fetchCategories();
        commit("setCategories", categories);
      } catch (error) {
        commit("setError", error.message);
        console.error("Error fetching categories:", error);
      }
    },
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === "light" ? "dark" : "light";
      commit("setTheme", newTheme);
    },
    login({ commit }, token) {
      const decodedToken = jwtDecode(token);
      commit("setAuth", true);
      commit("setUserId", decodedToken.userId);
      localStorage.setItem("jwt", token);

      // Load cart items specific to the user
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const userCart = storedCart.filter(
        (item) => item.userId === decodedToken.userId
      );
      commit("setCartFromLocalStorage", userCart);

      // Load wishlist items specific to the user
      const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const userWishlist = storedWishlist.filter(
        (item) => item.userId === decodedToken.userId
      );
      commit("addToWishlist", userWishlist);
    },
    logout({ commit }) {
      commit("setAuth", false);
      // No longer clearing cart from localStorage
      localStorage.removeItem("jwt");
    },
    addToCart({ commit, state }, item) {
      if (!state.isAuthenticated) {
        return; // Prevent adding to cart if not logged in
      }
      commit("addToCart", { ...item, userId: state.userId });
    },
    removeFromCart({ commit }, itemId) {
      commit("removeFromCart", itemId);
    },
    updateCartQuantity({ commit }, { itemId, quantity }) {
      commit("updateCartQuantity", { itemId, quantity });
    },
    clearCart({ commit }) {
      commit("clearCart");
    },
    addToComparison({ commit }, product) {
      commit("ADD_TO_COMPARISON", product);
    },
    removeFromComparison({ commit }, productId) {
      commit("REMOVE_FROM_COMPARISON", productId);
    },
    clearComparisonList({ commit }) {
      commit("CLEAR_COMPARISON_LIST");
    },
    loadComparisonList({ commit }) {
      const storedList = localStorage.getItem("comparisonList");
      if (storedList) {
        const products = JSON.parse(storedList);
        products.forEach((product) => commit("ADD_TO_COMPARISON", product));
      }
    },
    addToWishlist({ commit }, product) {
      commit("addToWishlist", product);
    },
    removeFromWishlist({ commit }, productId) {
      commit("removeFromWishlist", productId);
    },
    async initializeAuth({ commit }) {
      const token = localStorage.getItem("jwt");
      if (token) {
        const decodedToken = jwtDecode(token);
        commit("setAuth", true);
        commit("setUserId", decodedToken.userId);
        // Load wishlist items specific to the user
        const storedWishlist =
          JSON.parse(localStorage.getItem("wishlist")) || [];
        const userWishlist = storedWishlist.filter(
          (item) => item.userId === decodedToken.userId
        );
        commit("addToWishlist", userWishlist);
      }
    },

    addToCart({ commit, state }, product) {
      if (!state.isAuthenticated) {
        return; // Prevent adding to cart if not logged in
      }
      const productWithQuantity = {
        ...product,
        quantity: 1,
        userId: state.userId,
      };
      commit("addToCart", productWithQuantity);

      // Remove from wishlist after adding to cart
      commit("removeFromWishlist", product.id);
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
      if (state.sortOrder === "asc") {
        result.sort((a, b) => a.price - b.price);
      } else if (state.sortOrder === "desc") {
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
    wishlistItemCount(state) {
      return state.wishlist.length;
    },
    wishlist(state) {
      return state.wishlist;
    },
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
  },
});

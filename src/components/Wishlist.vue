<template>
        <div class="wishlist-page">
          <h1>My Wishlist</h1>
      
          <!-- Filtering and Sorting Controls -->
          <div class="controls">
            <div class="control">
              <label for="category">Filter by Category:</label>
              <select id="category" v-model="selectedCategory">
                <option value="">All</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
      
            <div class="control">
              <label for="sortOrder">Sort by Price:</label>
              <select id="sortOrder" v-model="sortOrder">
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
      
          <table v-if="filteredAndSortedWishlist.length > 0">
            <thead>
              <tr>
                <th>Product</th>
                <th>Description</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredAndSortedWishlist" :key="item.id">
                <td>{{ item.title }}</td>
                <td>{{ item.description }}</td>
                <td>\${{ item.price }}</td>
                <td>{{ item.rating?.rate || 'N/A' }}</td>
                <td>
                  <button @click="removeFromWishlist(item.id)">Remove</button>
                  <button @click="addToCart(item.id)">Add to Cart</button>
                </td>
              </tr>
            </tbody>
          </table>
      
          <button v-if="wishlist.length > 0" @click="clearWishlist">Clear Wishlist</button>
          <p v-else>No items in your wishlist</p>
        </div>
      </template>
      
      <script setup>
      import { ref, computed } from 'vue';
      import { useStore } from 'vuex';
      
      const store = useStore();
      
      // Safeguard against undefined wishlist
      const wishlist = computed(() => store.getters.wishlist || []);
      
      // State for filtering and sorting
      const selectedCategory = ref('');
      const sortOrder = ref('price-asc');
      
      // Compute unique categories from the wishlist items
      const categories = computed(() => {
        const uniqueCategories = new Set(wishlist.value.map(item => item.category));
        return Array.from(uniqueCategories);
      });
      
      // Compute the filtered and sorted wishlist
      const filteredAndSortedWishlist = computed(() => {
        let filteredWishlist = wishlist.value;
      
        // Filter by selected category
        if (selectedCategory.value) {
          filteredWishlist = filteredWishlist.filter(
            item => item.category === selectedCategory.value
          );
        }
      
        // Sort by price
        if (sortOrder.value === 'price-asc') {
          filteredWishlist.sort((a, b) => a.price - b.price);
        } else if (sortOrder.value === 'price-desc') {
          filteredWishlist.sort((a, b) => b.price - a.price);
        }
      
        return filteredWishlist;
      });
      
      // Function to remove an item from the wishlist
      function removeFromWishlist(productId) {
        store.dispatch('removeFromWishlist', productId);
      }
      
      // Function to add an item from the wishlist to the cart
      function addToCart(productId) {
        store.dispatch('addToCart', productId);
      }
      
      // Function to clear the entire wishlist
      function clearWishlist() {
        store.dispatch('clearWishlist');
      }
      </script>
      
      
      
      
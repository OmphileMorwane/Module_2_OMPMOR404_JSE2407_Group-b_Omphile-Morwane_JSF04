<template>
        <div class="login-container">
          <h2>Login</h2>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="username">Username</label>
              <input v-model="username" type="text" id="username" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input :type="passwordVisible ? 'text' : 'password'" v-model="password" id="password" required />
              <button type="button" class="password-toggle-button" @click="togglePasswordVisibility">
                {{ passwordVisible ? 'Hide' : 'Show' }}
              </button>
            </div>
            <button type="submit" class="login-button" :disabled="isLoading">Login</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <p v-if="isLoading" class="loading-message">Logging in...</p>
          </form>
        </div>
      </template>
      
      
      <script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { loginUser } from './api'; // Import the loginUser function

const username = ref('');
const password = ref('');
const passwordVisible = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const router = useRouter();
const store = useStore();

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = 'Username and password are required';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const data = await loginUser(username.value, password.value);
    store.commit('setAuth', true);
    localStorage.setItem('jwt', data.token);

    // Redirect to the intended page or home if no redirect is specified
    const redirectTo = router.currentRoute.value.query.redirect || '/';
    router.push(redirectTo);
  } catch (error) {
    errorMessage.value = error.message || 'Login failed';
  } finally {
    isLoading.value = false;
  }
};
</script>
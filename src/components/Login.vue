<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="username" type="text" id="username" required />
      </div>
      <div class="form-group password-group">
        <label for="password">Password</label>
        <div class="password-input-container">
          <input
            :type="passwordVisible ? 'text' : 'password'"
            v-model="password"
            id="password"
            required
          />
          <span class="password-toggle-icon" @click="togglePasswordVisibility">
            <svg
              v-if="passwordVisible"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="eye-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223a10.477 10.477 0 0116.04 0m-2.54 2.627A3.48 3.48 0 0012 8.25c-1.212 0-2.317.61-3.48 1.623M21 15.75l-3.26-3.26m0 0L18 13.5a10.477 10.477 0 01-6 1.5 10.477 10.477 0 01-6-1.5m0 0L3 15.75M12 19.5A4.5 4.5 0 007.5 15m9 0A4.5 4.5 0 0012 19.5m0 0A4.5 4.5 0 0016.5 15m-9 0A4.5 4.5 0 0012 19.5z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="eye-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223a10.477 10.477 0 0116.04 0M15.38 10.85A3.48 3.48 0 0112 11.75c-1.212 0-2.317-.61-3.48-1.623M21 15.75l-3.26-3.26m0 0L18 13.5a10.477 10.477 0 01-6 1.5 10.477 10.477 0 01-6-1.5m0 0L3 15.75"
              />
            </svg>
          </span>
        </div>
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

/**
 * The username entered by the user.
 * @type {Ref<string>}
 */
const username = ref('');

/**
 * The password entered by the user.
 * @type {Ref<string>}
 */
const password = ref('');

/**
 * A boolean indicating whether the password input is visible or hidden.
 * @type {Ref<boolean>}
 */
const passwordVisible = ref(false);

/**
 * A boolean indicating whether the login request is in progress.
 * @type {Ref<boolean>}
 */
const isLoading = ref(false);

/**
 * The error message to display if login fails.
 * @type {Ref<string>}
 */
const errorMessage = ref('');

/**
 * The Vue Router instance used for navigation.
 * @type {Router}
 */
const router = useRouter();

/**
 * The Vuex store instance used to manage authentication state.
 * @type {Store}
 */
const store = useStore();

/**
 * Toggles the visibility of the password input.
 */
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

/**
 * Handles the login process by validating input and calling the API.
 * Redirects to the intended page or home if login is successful.
 */
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

<style scoped>
/* Basic styling */
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.password-group {
  position: relative;
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-toggle-icon {
  position: absolute;
  right: 10px;
  cursor: pointer;
}

.eye-icon {
  width: 24px;
  height: 24px;
  color: #555;
}

.eye-icon:hover {
  color: #000;
}
</style>

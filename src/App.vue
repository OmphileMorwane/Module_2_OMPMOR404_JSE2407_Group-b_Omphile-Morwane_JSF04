<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>

    <!--Theme toggle button-->
    <div class="theme-toggle">
      <button
        :class="theme === 'light' ? 'light-theme-button' : 'dark-theme-button'"
        @click="toggleTheme"
      >
        <i :class="theme === 'light' ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, watchEffect } from "vue";
import { useStore } from "vuex";
import Header from "./components/Header.vue";

const store = useStore();
const theme = computed(() => store.state.theme);

// Toggle theme and commit to Vuex store
const toggleTheme = () => {
  const currentTheme = store.state.theme;
  const newTheme = currentTheme === "light" ? "dark" : "light";
  store.commit("setTheme", newTheme); // Commit the new theme to Vuex store
};

// Apply theme when it changes
watchEffect(() => {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme.value);
});
</script>

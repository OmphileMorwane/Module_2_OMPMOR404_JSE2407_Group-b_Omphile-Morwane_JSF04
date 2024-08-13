<template>
  <div id="app">
    <Header></Header>
     <router-view></router-view>

     <!--Theme toggle button-->
     <div class="theme-toggle">
      <button @click="toggleTheme">
        <i :class="theme === 'light' ? 'fas fa-sun' : 'fas fa-moon'"></i>
        
      </button>
    </div>   
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Header from './components/Header.vue'

const store = useStore();
const theme = computed(() => store.state.theme);

const toggleTheme = () => {
  store.commit('toggleTheme');
};

</script>


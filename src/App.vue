<template>
  <div id="app">
    <Header></Header>
     <router-view></router-view>
    
   
  </div>
</template>

<script setup>
/**
 * Import the Header component.
 */
import Header from './components/Header.vue'

</script>

<style >
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden; 
  background-color: #e1f7fa;
  color: #333333;

  
}

#app {
  margin:0;
 padding: 0;
  width: 100%;
}

* {
  box-sizing:content-box; /* Include padding and border in element's total width and height */
}

</style>


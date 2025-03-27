<template>
  <div id="app">
    <BackGround />
    <Header />
    <router-view />
  </div>
</template>

<script setup>
import BackGround from './components/backGround.vue'
import Header from './components/Header.vue'
</script>
<style scoped>

</style>

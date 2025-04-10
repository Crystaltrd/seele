<template>
  <div id="app">
    <Background />
    <Header v-if="showHeader" />
    <router-view />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import Background from './components/background.vue';
import Header from './components/Header.vue';

const route = useRoute();
const showHeader = ref(true);

watchEffect(() => {
  showHeader.value = route.path !== "/login" && route.path !== "/signup";
});
</script>

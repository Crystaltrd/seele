<template>
  <div id="app">
    <Background />
    <Header v-if="showHeader" />
    <main>
      <router-view />
    </main>
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import Background from './components/background.vue';
import Header from './components/Header.vue';
import Footer from "./components/Footer.vue";

const route = useRoute();
const showHeader = ref(true);
const showFooter= ref(true);

watchEffect(() => {
  showHeader.value = route.path !== "/login" && route.path !== "/signup" && route.path !=="/admin";
  showFooter.value = route.path !== "/login" && route.path !== "/signup" && route.path !=="/admin";
});
</script>

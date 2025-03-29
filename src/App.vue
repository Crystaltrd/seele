<template>
  <div id="app">
    <BackGround />
    <Header v-if="showHeader" />
    <router-view />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import BackGround from './components/backGround.vue';
import Header from './components/Header.vue';

const route = useRoute();
const showHeader = ref(true);

watchEffect(() => {
  showHeader.value = route.path !== "/login";
});
</script>

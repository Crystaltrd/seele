<script setup>

import Background from "../components/background.vue";
import { ref } from 'vue';

const inputValue = ref('');

const fetchUrl = async () => {
  if (!inputValue.value.trim()) return;

  try {

    const response = await fetch(inputValue.value);

    if (!response.ok) {
      throw new Error(`http error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error('query error:', error);
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    fetchUrl();
  }
};
</script>

<template>
  <Background/>

  <div class="input-container">
    <input type="text" placeholder="Write something" class="custom-input" v-model="inputValue" @keydown="handleKeyDown">
  </div>

</template>
<style scoped>
.input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  z-index: 1;
}

.custom-input {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 300px;
  outline: none;
}

</style>
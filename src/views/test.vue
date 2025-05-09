<script setup>

import Background from "../components/background.vue";
import { ref } from 'vue';

const inputValue = ref('');
const requestMethod1 = ref('GET');

const fetchUrl = async () => {
  if (!inputValue.value.trim()) return;

  try{
    const options= {
      method : requestMethod1.value,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch(inputValue.value,options);

    if (!response.ok) {
      throw new Error(`http error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error('query error:', error);
  }
};

const setMethod = (method) => {
  requestMethod1.value = method;
};
const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    fetchUrl();
  }
};
</script>

<template>
  <Background/>
  <div class="container">
    <div class="input-group">
      <input type="text" placeholder="say smth" class="custom-input" v-model="inputValue" @keydown="handleKeyDown">

      <div class="controls">
        <div class="method-buttons">
          <button @click="setMethod('GET')" :class="{ active: requestMethod1 === 'GET' }" class="method-button">GET</button>
          <button @click="setMethod('POST')" :class="{ active: requestMethod1 === 'POST' }" class="method-button">POST</button>
        </div>
        <button @click="fetchUrl" class="send-button">Send</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  z-index: 1;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 300px;
}

.custom-input {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 300px;
  outline: none;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
}
.method-buttons {
  display: flex;
  gap: 5px;
}

.method-button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  flex: 1;
}

.method-button.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.send-button {
  padding: 10px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.send-button:hover {
  background: #0b7dda;
}
</style>
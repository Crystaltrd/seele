<template>
  <router-view />
  <div class="admin-container">
      <Background/>
      <AdminsHeader/>

    <button type="button" class="go-back-btn" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>
  </div>

</template>

<script setup>
import Background from "../components/background.vue";
import router from "../router";
import AdminsHeader from "../components/AdminsHeader.vue";
import {useRoute} from "vue-router";
import {onMounted} from "vue";

const goBack = () => {
  router.push('/');
};
const route = useRoute();

onMounted(() => {
  if (route.path === '/admin') {
    router.replace('/Dashboard');
  }
});
</script>

<style scoped>
.admin-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 20px 0;
}

.go-back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(74, 144, 226, 0.1);
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  padding: 8px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.go-back-btn:hover {
  background: rgba(74, 144, 226, 0.1);
  transform: translateX(-3px);
}

.go-back-btn i {
  font-size: 0.8rem;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 5px;
  font-weight: 700;
  color: white;
}

@media (max-width: 768px) {
}

@media (max-width: 992px) {
}

@media (max-width: 768px) {
}

@media (max-width: 576px) {
}

@media (max-width: 400px) {
  .go-back-btn {
    top: 10px;
    left: 10px;
    font-size: 0.8rem;
    padding: 6px 10px;
  }
}
</style>
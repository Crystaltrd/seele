<template>
  <router-view />
  <div class="admin-container">
      <Background/>

    <button type="button" class="go-back-btn" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>

    <div class="wrapper">
      <header class="header">
        <img alt="LOGO" id="logo" src="../assets/univLogo.png">
        <h1>Welcome to the alexandria's management page</h1>
      </header>

    </div>
  </div>

</template>

<script setup>
import Background from "../components/background.vue";
import router from "../router";

const goBack = () => {
  router.push('/');
};

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

.wrapper {
  position: relative;
  z-index: 1;
  width: 1150px;
  max-width: 95%;
  border-radius: 8px;
  padding: 30px;
  margin: 10px auto;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

#logo {
  width: 130px;
  height: auto;
  margin-bottom: 5px;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 5px;
  font-weight: 700;
  color: white;
}

@media (max-width: 768px) {
  .wrapper {
    padding: 25px;
    margin: 20px auto;
    max-height: none;
    overflow-y: auto;
  }
}

@media (max-width: 992px) {
  .wrapper {
    padding: 25px;
  }
}

@media (max-width: 768px) {
  .wrapper {
    padding: 20px;
    margin: 40px auto;
  }
}

@media (max-width: 576px) {
  .wrapper {
    padding: 20px;
    margin: 15px auto;
  }
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
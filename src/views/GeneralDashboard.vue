<template>
  <div class="dashboard-container">
     <Background/>
      <AdminsHeader/>

    <section id="history">
      <div class="container">
        <div class="content-wrapper">
          <h3 class="section-heading">General History</h3>
          <div class="history-grid">
            <div class="filter-wrapper">
              <div class="input-field">
                <select id="filter" class="select">
                  <option value="">Filter</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="alert">
      <div class="container">
        <div class="content-wrapper">
          <h3 class="section-heading">Delay Alerts</h3>
          <div class="alert-grid">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>

import Background from "../components/background.vue";
import AdminsHeader from "../components/AdminsHeader.vue";
</script>

<style scoped>
.dashboard-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.container {
  max-width: 1200px;
  padding: 0 1rem;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  background: rgba(44, 44, 58, 0.1);
  backdrop-filter: blur(3px);
  border-radius: 20px;
  padding: 0 1.5rem;
  width: 1100px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.section-heading {
  font-size: 2.2rem;
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.section-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #4a90e2, transparent);
}

#history ,#alert{
  padding: 8rem 0;
  display: flex;
  align-items: center;
}

.history-grid , .alert-grid{
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  scrollbar-width: none;
  justify-content: center;
  flex-wrap: wrap;
}

.history-grid , .alert-grid::-webkit-scrollbar {
  display: none;
}

.select {
  width: 100%;
  min-width: 150px;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.select {
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.select:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  width: 100%;
  min-width: 150px;
}

.filter-wrapper {
  margin-left: auto;
}
</style>
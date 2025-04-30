<template>
  <div class="publication-container">
    <Background/>
    <AdminsHeader/>

    <section id="publication">
      <div class="container">
        <div class="content-wrapper">
          <h3 class="section-heading">Publications list</h3>
          <div class="account-grid">
            <div class="filter-wrapper">
              <div class="input-field">
                <select id="filter" class="select">
                  <option value="">Filter</option>
                </select>
              </div>
            </div>

            <div class="btn-wrapper">
              <button class="btn" type="submit">
                <i class="fa-solid fa-plus" style="color: #ffffff;"></i>
                <span>add</span>
              </button>

              <button class="btn" type="submit">
                <i class="fa-solid fa-minus" style="color: #ffffff;"></i>
                <span>delete</span>
              </button>

              <button class="btn" type="submit">
                <i class="fa-solid fa-pen" style="color: #ffffff;"></i>
                <span>modify</span>
              </button>
            </div>
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
.publication-container {
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

#publication{
  padding: 8rem 0;
  display: flex;
  align-items: center;
}

.account-grid {
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  scrollbar-width: none;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
}

.account-grid::-webkit-scrollbar {
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

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #4A90E2;
  width: fit-content;
  color: white;
  font-weight: 600;
  padding: 0.8rem 2rem;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  border: none;
  transition: all 0.3s ease;
}

.btn-wrapper {
  display: flex;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  margin-top: 1rem;
}

.btn i{
  margin-right: 5px;
}

.btn:hover {
  background: #3a7bc8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.btn:active {
  transform: translateY(0);
}
</style>
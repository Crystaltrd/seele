<template>
  <div class="dashboard-container">
    <Background/>
    <AdminsHeader/>

    <div class="admin-btn-container" v-if="showAdminButton">
      <button type="button" class="admin-btn" @click="goToAdmin">
        <i class="fa-solid fa-house" style="color: #ffffff;"></i>
      </button>
    </div>

    <section id="alert">
      <div class="container">
        <div class="content-wrapper">
          <h3 class="section-heading">Display alerts</h3>
          <div class="alert-grid">
            <div v-if="isLoading" class="loading">
              <svg viewBox="25 25 50 50" class="spinner">
                <circle r="20" cy="50" cx="50"></circle>
              </svg>
            </div>

            <div v-else-if="frozenAccounts.length === 0" class="empty">
              No frozen accounts found
            </div>

            <div class="accounts-list">
              <div
                  class="account-item"
                  v-for="account in frozenAccounts"
                  :key="account['UUID']"
              >
                <div class="account-info">
                  <div class="uuid-display">
                    <span class="uuid-label">UUID:</span>
                    <span class="uuid-value">{{ account['UUID'] }}</span>
                  </div>
                  <div class="display-name">
                    <span class="name-label">Display Name:</span>
                    <span class="name-value">{{ account.displayname }}</span>
                  </div>
                  <div class="meta">
                    <div class="meta-item">
                      <span class="meta-label">Role:</span>
                      <span class="meta-value">{{ account.role }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Campus:</span>
                      <span class="meta-value">{{ account.campus }}</span>
                    </div>
                  </div>
                  <div class="status-info">
                    <span class="inactive">Frozen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

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

  </div>
</template>

<script setup>
import Background from "../components/background.vue";
import AdminsHeader from "../components/AdminsHeader.vue";
import {useRouter} from "vue-router";
import {onMounted, ref, computed} from "vue";

const router = useRouter();
const showAdminButton = ref(false);
const accounts = ref([]);
const isLoading = ref(true);

const goToAdmin = () => {
  router.push('/');
};

const checkAdminAccess = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  showAdminButton.value = isAuthenticated && ["ADMIN", "STAFF", "SHELF MANAGER", "LIBRARIAN"].includes(userRole);
};

const frozenAccounts = computed(() => {
  return accounts.value.filter(account => account.frozen === 1);
});

async function fetchAccounts() {
  try {
    isLoading.value = true;
    const response = await fetch(`${apiurl}query/account`, {
      method: "GET",
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    });

    const data = await response.json();
    if (data.res) {
      accounts.value = data.res;
    }
  } catch (error) {
    console.error("Error fetching accounts:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await fetchAccounts();
  checkAdminAccess();
});
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

#history, #alert {
  padding: 8rem 0;
  display: flex;
  align-items: center;
}

.history-grid, .alert-grid {
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  scrollbar-width: none;
  justify-content: center;
  flex-wrap: wrap;
}

.history-grid, .alert-grid::-webkit-scrollbar {
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

.admin-btn-container {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
}

.admin-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.admin-btn:hover {
  background: rgba(74, 144, 226, 0.3);
  transform: translateY(-2px);
}

.admin-btn i {
  font-size: 0.8rem;
}

.accounts-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.account-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.account-item:hover {
  background: rgba(244, 67, 54, 0.1);
  transform: translateX(5px);
}

.account-info h4 {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 1.1rem;
}

.uuid-display {
  margin-bottom: 0.5rem;
}

.uuid-label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-right: 0.5rem;
}

.uuid-value {
  font-weight: 600;
  color: #4A90E2;
  font-size: 1rem;
}

.display-name {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.name-label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-right: 0.5rem;
}

.name-value {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: baseline;
}

.meta-label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  min-width: 70px;
}

.meta-value {
  color: rgba(255, 255, 255, 0.7);
}

.status-info {
  margin-top: 1rem;
  text-align: right;
}

.status-info span {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-info .inactive {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
}

.spinner {
  width: 50px;
  height: 50px;
}

.spinner circle {
  fill: none;
  stroke: #4A90E2;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite, rotate 2s linear infinite;
  transform-origin: center;
}

.empty {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  padding: 2rem;
  width: 100%;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
}
</style>
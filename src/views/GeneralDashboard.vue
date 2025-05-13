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

          <div class="history-controls">
            <div class="filter-container">
              <select v-model="selectedFilter" class="styled-select" @change="fetchHistory">
                <option value="">All Actions</option>
                <option v-for="action in actionTypes" :value="action">{{ action }}</option>
              </select>
              <button @click="fetchHistory" class="refresh-btn">
                <i class="fa-solid fa-rotate"></i> Refresh
              </button>
            </div>

            <div class="pagination-controls" v-if="historyEntries.length > 0">
              <button @click="prevPage" :disabled="currentPage === 1">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <span>Page {{ currentPage }} ({{ historyEntries.length }} of {{ totalItems }} entries)</span>
              <button @click="nextPage" :disabled="currentPage * itemsPerPage >= totalItems">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div v-if="isLoadingHistory" class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading history...</p>
          </div>

          <div v-else-if="historyEntries.length === 0" class="empty-state">
            <i class="fa-solid fa-clock-rotate-left"></i>
            <p>No history entries found</p>
          </div>

          <div class="history-list" v-else>
            <div class="history-item" v-for="(entry, index) in historyEntries" :key="index">
              <div class="entry-icon" :class="getActionClass(entry.action)">
                <i :class="getActionIcon(entry.action)"></i>
              </div>
              <div class="entry-content">
                <div class="entry-header">
              <span class="action-badge" :class="getActionClass(entry.action)">
                {{ entry.action }}
              </span>
                  <span class="entry-date">{{ formatDateTime(entry.actiondate) }}</span>
                </div>
                <div class="entry-details">
                  <div class="detail-row">
                    <span class="detail-label">IP Address:</span>
                    <span class="detail-value">{{ entry.IP }}</span>
                  </div>
                  <div v-if="entry.details" class="detail-row">
                    <span class="detail-label">Details:</span>
                    <span class="detail-value">{{ entry.details }}</span>
                  </div>
                </div>
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
import { watch } from 'vue';

const router = useRouter();
const showAdminButton = ref(false);
const accounts = ref([]);
const isLoading = ref(true);
const historyEntries = ref([]);
const isLoadingHistory = ref(true);
const selectedFilter = ref("");
const actionTypes = ref(["LOGIN", "LOGOUT", "EDIT", "RENT", "RETURN", "EXTEND", "FREEZE", "UNFREEZE"]);
const currentPage = ref(1);
const itemsPerPage = 25;
const totalItems = ref(0);

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

async function fetchHistory() {
  try {
    isLoadingHistory.value = true;

    if (selectedFilter.value) {
      currentPage.value = 1;
    }

    let url = `${apiurl}query/history?page=${currentPage.value}&limit=${itemsPerPage}`;

    if (selectedFilter.value) {
      url += `&action=${encodeURIComponent(selectedFilter.value)}`;
    }

    console.log("URL complète:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("Données reçues:", data);

    if (data?.res) {
      historyEntries.value = data.res.map(entry => ({
        action: entry.action || 'UNKNOWN',
        actiondate: entry.actiondate || new Date().toISOString(),
        IP: entry.IP || 'N/A',
        details: entry.details || null
      }));
      totalItems.value = data.nbrres || data.res.length;
    } else {
      historyEntries.value = [];
      totalItems.value = 0;
    }
  } catch (error) {
    console.error("Error fetching history:", error);
    historyEntries.value = [];
    totalItems.value = 0;
  } finally {
    isLoadingHistory.value = false;
  }
}

function getActionClass(action) {
  return {
    'login': action === 'LOGIN',
    'logout': action === 'LOGOUT',
    'edit': action === 'EDIT',
    'rent': action === 'RENT',
    'return': action === 'RETURN',
    'extend': action === 'EXTEND',
    'freeze': action === 'FREEZE',
    'unfreeze': action === 'UNFREEZE'
  };
}

function getActionIcon(action) {
  const icons = {
    'LOGIN': 'fa-sign-in-alt',
    'LOGOUT': 'fa-sign-out-alt',
    'EDIT': 'fa-edit',
    'RENT': 'fa-book',
    'RETURN': 'fa-book-return',
    'EXTEND': 'fa-calendar-plus',
    'FREEZE': 'fa-snowflake',
    'UNFREEZE': 'fa-fire'
  };
  return 'fa-solid ' + (icons[action] || 'fa-circle-info');
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function nextPage() {
  if (currentPage.value * itemsPerPage < totalItems.value) {
    currentPage.value++;
    fetchHistory();
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchHistory();
  }
}

watch(selectedFilter, (newVal) => {
  if (newVal) {
    fetchHistory();
  }
});

onMounted(async () => {
  await fetchAccounts();
  await fetchHistory();
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

#alert {
  padding: 8rem 0;
  display: flex;
  align-items: center;
}

#history{
  padding: 0 0 8rem 0;
  display: flex;
  align-items: center;
}

.alert-grid {
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  scrollbar-width: none;
  justify-content: center;
  flex-wrap: wrap;
}

.alert-grid::-webkit-scrollbar {
  display: none;
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



.history-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}



.entry-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}



#history {
  padding: 0 0 10rem 0;
  display: flex;
  align-items: center;
  min-height: 60vh;
}

.history-controls {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.filter-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.styled-select {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(30, 30, 40, 0.8);
  color: white !important;
  font-size: 0.9rem;
  min-width: 180px;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

.styled-select option {
  background: rgba(30, 30, 40, 0.95);
  color: white;
}

.styled-select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.styled-select:hover {
  background: rgba(255, 255, 255, 0.12);
}

.refresh-btn {
  padding: 0.6rem 1rem;
  background: rgba(74, 144, 226, 0.2);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: rgba(74, 144, 226, 0.3);
}

.refresh-btn i {
  font-size: 0.9rem;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.7);
}

.loading-spinner .spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(74, 144, 226, 0.2);
  border-top-color: #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.5);
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.history-item {
  background: rgba(30, 30, 40, 0.5);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.history-item:hover {
  background: rgba(40, 40, 50, 0.7);
  transform: translateY(-2px);
}

.entry-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.entry-icon.login { background: rgba(76, 175, 80, 0.15); color: #4CAF50; }
.entry-icon.logout { background: rgba(244, 67, 54, 0.15); color: #F44336; }
.entry-icon.edit { background: rgba(255, 152, 0, 0.15); color: #FF9800; }
.entry-icon.rent { background: rgba(33, 150, 243, 0.15); color: #2196F3; }
.entry-icon.return { background: rgba(156, 39, 176, 0.15); color: #9C27B0; }
.entry-icon.extend { background: rgba(0, 150, 136, 0.15); color: #009688; }
.entry-icon.freeze { background: rgba(233, 30, 99, 0.15); color: #E91E63; }
.entry-icon.unfreeze { background: rgba(103, 58, 183, 0.15); color: #673AB7; }

.entry-content {
  flex-grow: 1;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.action-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-badge.login { background: rgba(76, 175, 80, 0.2); color: #4CAF50; }
.action-badge.logout { background: rgba(244, 67, 54, 0.2); color: #F44336; }
.action-badge.edit { background: rgba(255, 152, 0, 0.2); color: #FF9800; }
.action-badge.rent { background: rgba(33, 150, 243, 0.2); color: #2196F3; }
.action-badge.return { background: rgba(156, 39, 176, 0.2); color: #9C27B0; }
.action-badge.extend { background: rgba(0, 150, 136, 0.2); color: #009688; }
.action-badge.freeze { background: rgba(233, 30, 99, 0.2); color: #E91E63; }
.action-badge.unfreeze { background: rgba(103, 58, 183, 0.2); color: #673AB7; }

.entry-date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.entry-details {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.detail-row {
  display: flex;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.detail-label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.detail-value {
  color: rgba(255, 255, 255, 0.6);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  color: rgba(255, 255, 255, 0.7);
}

.pagination-controls button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
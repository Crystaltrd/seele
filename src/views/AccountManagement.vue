<template>
  <div class="account-container">
    <Background/>
    <AdminsHeader/>

    <div class="admin-btn-container" v-if="showAdminButton">
      <button type="button" class="admin-btn" @click="goToAdmin">
        <i class="fa-solid fa-house" style="color: #ffffff;"></i>
      </button>
    </div>

    <section id="account">
      <div class="container">
        <div class="content-wrapper">
          <h3 class="section-heading">Account list</h3>
          <div class="account-grid">
            <div class="filter-actions-wrapper">
              <div class="btn-wrapper">
                <button class="btn" type="button" @click="showAddModal = true">
                  <i class="fa-solid fa-user-plus" style="color: #ffffff;"></i>
                  <span>add</span>
                </button>

                <button class="btn" type="button" @click="deleteAccount">
                  <i class="fa-solid fa-user-minus" style="color: #ffffff;"></i>
                  <span>delete</span>
                </button>

                <button class="btn" type="button" @click="showEditAlert">
                  <i class="fa-solid fa-user-pen" style="color: #ffffff;"></i>
                  <span>Edit</span>
                </button>
              </div>

              <div class="filter-wrapper">
                <div class="input-field">
                  <select id="filter-type" class="select" v-model="filterType">
                    <option value="">Filter by...</option>
                    <option value="role">Role</option>
                    <option value="campus">Campus</option>
                    <option value="status">Frozen</option>
                  </select>
                </div>

                <div class="input-field" v-if="filterType">
                  <select
                      id="filter-value"
                      class="select"
                      v-model="filterValue"
                      @change="applyFilter"
                  >
                    <option value="">All {{ filterType }}</option>
                    <option
                        v-for="option in filterOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>

              <button
                  class="btn"
                  type="button"
                  @click="resetFilters"
                  v-if="filterType"
              >
                <i class="fa-solid fa-rotate-left"></i>
                <span>Reset</span>
              </button>
            </div>

            <div v-if="isLoading" class="loading">
              <svg viewBox="25 25 50 50" class="spinner">
                <circle r="20" cy="50" cx="50"></circle>
              </svg>
            </div>

            <div v-else-if="accounts.length === 0" class="empty">
              No accounts found
            </div>

            <div class="accounts-list">
              <div
                  class="account-item"
                  v-for="account in accounts"
                  :key="account.id"
                  :class="{ selected: selectedAccount?.id === account.id }"
                  @click="selectAccount(account)"
              >
                <div class="account-info">
                  <div class="selected-indicator" v-if="selectedAccount?.['ACCOUNT.UUID'] === account['ACCOUNT.UUID']">
                    <i class="fa-solid fa-check"></i>
                  </div>
                  <h4>{{ account['ACCOUNT.UUID'] }}</h4>
                  <div class="meta">
                    <span>{{ account.disp_name}}</span>
                    <span>{{ account.role }} ({{ account.campus }})</span>
                  </div>
                  <div class="status-info">
                    <span :class="account.frozen ? 'inactive' : 'active'"> {{ account.frozen ? 'Frozen' : 'Active' }}</span>
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
import { ref, onMounted, watch } from 'vue'
import Background from "../components/background.vue"
import AdminsHeader from "../components/AdminsHeader.vue"
import Swal from 'sweetalert2'
import {useRouter} from "vue-router";

const accounts = ref([])
const isLoading = ref(true)
const showAddModal = ref(false)
const campuses = ref([])
const loadingCampuses = ref(false)
const serverError = ref("")
const selectedAccount = ref(null)
const filterType = ref('')
const filterValue = ref('')
const filterOptions = ref([])
const originalAccounts = ref([])
const router = useRouter();
const showAdminButton = ref(false);


const roles = ref(['ADMIN', 'USER', 'LIBRARIAN', 'STAFF', 'SHELF MANAGER'])
const statuses = ref(['Active', 'Frozen'])

function resetFilters() {
  filterType.value = '';
  filterValue.value = '';
  accounts.value = [...originalAccounts.value];
}

const goToAdmin = () => {
  router.push('/');
};

const checkAdminAccess = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  showAdminButton.value = isAuthenticated && ["ADMIN", "STAFF", "SHELF MANAGER", "LIBRARIAN"].includes(userRole);
};

watch(filterType, (newType) => {
  filterValue.value = '';
  updateFilterOptions(newType);
});

function updateFilterOptions(type) {
  if (!type) {
    filterOptions.value = [];
    return;
  }

  switch(type) {
    case 'role':
      filterOptions.value = roles.value.map(role => ({
        value: role,
        label: role
      }));
      break;
    case 'campus':
      filterOptions.value = campuses.value.map(campus => ({
        value: campus,
        label: campus
      }));
      break;
    case 'status':
      filterOptions.value = statuses.value.map(status => ({
        value: status,
        label: status
      }));
      break;
  }
}

function applyFilter() {
  if (!filterValue.value) {
    accounts.value = [...originalAccounts.value];
    return;
  }

  accounts.value = originalAccounts.value.filter(account => {
    switch(filterType.value) {
      case 'role':
        return account.role === filterValue.value;
      case 'campus':
        return account.campus === filterValue.value;
      case 'status':
        if (filterValue.value === 'Active') {
          return account.frozen === 0;
        } else {
          return account.frozen === 1;
        }
      default:
        return true;
    }
  });
}

function selectAccount(account) {
  selectedAccount.value = selectedAccount.value?.['ACCOUNT.UUID'] === account['ACCOUNT.UUID']
      ? null
      : account;
}

function showEditAlert() {
  Swal.fire({
    title: "Option not available yet",
    text: "This feature is not yet available but will be soon!",
    icon: "info",
    iconColor: "#4A90E2",
    background: "#2c2c3a",
    color: "#fff",
    confirmButtonColor: "#4A90E2"
  });
}

async function deleteAccount() {
  if (!selectedAccount.value) {
    await Swal.fire({
      title: "No account selected",
      text: "Please select an account first",
      icon: "warning",
      iconColor: "#FFA726",
      background: "#2c2c3a",
      color: "#fff"
    });
    return;
  }

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    iconColor: "#FFA726",
    showCancelButton: true,
    confirmButtonColor: "#4A90E2",
    cancelButtonColor: "#FF5252",
    background: "#2c2c3a",
    color: "#fff",
    confirmButtonText: "Yes, delete it!"
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`${apiurl}account/${selectedAccount.value['ACCOUNT.UUID']}`, {
        method: "DELETE",
        credentials: 'include'
      });

      if (response.ok) {
        await Swal.fire({
          title: "Deleted!",
          text: "The account has been deleted.",
          icon: "success",
          iconColor: "#4A90E2",
          background: "#2c2c3a",
          color: "#fff"
        });
        await fetchAccounts();
        selectedAccount.value = null;
      }
    } catch (error) {
      await Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the account.",
        icon: "error",
        iconColor: "#FF5252",
        background: "#2c2c3a",
        color: "#fff"
      });
    }
  }
}

async function getCampuses() {
  serverError.value = ""
  loadingCampuses.value = true
  try {
    const response = await fetch(apiurl + 'query/campus', {
      method: "GET",
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    })

    const data = await response.json();
    if (data.res) {
      campuses.value = data.res.map(c => c.campusName).filter(Boolean);
    } else {
      serverError.value = "Server error. Please try again later."
    }
  } catch (error) {
    serverError.value = "Network error. Please check your connection."
  } finally {
    loadingCampuses.value = false
  }
}

async function fetchAccounts() {
  try {
    isLoading.value = true;
    const response = await fetch(`${apiurl}query/account`, {
      method: "GET",
      headers: { 'Accept': 'application/json',},
      credentials: 'include'
    });

    const data = await response.json();
    if (data.res) {
      accounts.value = data.res;
      originalAccounts.value = [...data.res];
    }
  } catch (error) {
    console.error("Error fetching accounts:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await Promise.all([
    fetchAccounts(),
    getCampuses()
  ]);
  updateFilterOptions(filterType.value);
  checkAdminAccess();
});
</script>

<style scoped>
.account-container {
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

#account {
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

.filter-actions-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 2rem;
  margin-bottom: 2rem;
}

.filter-wrapper {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
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

@media (max-width: 768px) {
  .filter-wrapper {
    flex-direction: column;
  }
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
  gap: 2rem;
  justify-content: center;
  margin-top: 0;
}

.btn i {
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

.accounts-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.account-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.account-item:hover {
  background: rgba(74, 144, 226, 0.1);
  transform: translateX(5px);
}

.account-item.selected {
  background: rgba(74, 144, 226, 0.1) !important;
  transform: translateX(5px);
  border-left: 3px solid #4A90E2;
}

.account-info {
  position: relative;
  padding-right: 1rem;
}

.account-info h4 {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.meta {
  display: flex;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.meta span {
  transition: color 0.3s ease;
}

.status-info span {
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-info .active {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.status-info .inactive {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.status-info .pending {
  background: rgba(255, 152, 0, 0.2);
  color: #FF9800;
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

.select {
  width: 100%;
  min-width: 150px;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white !important;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

.select:hover, .select:focus {
  border-color: rgba(255, 255, 255, 0.5);
  outline: none;
}

.select:focus {
  border-color: #4A90E2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.select option {
  background-color: #2c2c3a;
  color: white !important;
  padding: 0.5rem;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.account-item {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.account-item:hover {
  background: rgba(74, 144, 226, 0.1);
  transform: translateX(5px);
}

.account-item.selected {
  background: rgba(74, 144, 226, 0.2) !important;
  transform: translateX(5px);
  border-left: 4px solid #4A90E2;
  box-shadow: 0 0 15px rgba(74, 144, 226, 0.3);
  position: relative;
  z-index: 1;
}

.account-item.selected::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(74, 144, 226, 0.5);
  border-radius: 8px;
  pointer-events: none;
  animation: pulse 2s infinite;
}

.account-item.selected .account-info h4 {
  color: #4A90E2;
  font-weight: 600;
}

.account-item.selected .meta span {
  color: rgba(255, 255, 255, 0.9);
}

.account-item.selected .status-info span {
  font-weight: 500;
}

.selected-indicator {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 25px;
  height: 25px;
  background: #4A90E2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  box-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
  z-index: 2;
}

@keyframes pulse {
  0% {
    border-color: rgba(74, 144, 226, 0.5);
  }
  50% {
    border-color: rgba(74, 144, 226, 0.8);
  }
  100% {
    border-color: rgba(74, 144, 226, 0.5);
  }
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
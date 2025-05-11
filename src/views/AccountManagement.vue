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
                    <option value="status">Status</option>
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
                  :key="account['ACCOUNT.UUID']"
                  :class="{ selected: selectedAccount?.['ACCOUNT.UUID'] === account['ACCOUNT.UUID'] }"
                  @click="selectAccount(account)"
              >
                <div class="account-info">
                  <div class="selected-indicator" v-if="selectedAccount?.['ACCOUNT.UUID'] === account['ACCOUNT.UUID']">
                    <i class="fa-solid fa-check"></i>
                  </div>
                  <h4 id="display-name">{{ account.disp_name }}</h4>
                  <div class="meta">
                    <span>{{ account['ACCOUNT.UUID'] }}</span>
                    <span>{{ account.role }} ({{ account.campus }})</span>
                  </div>
                  <div class="status-info">
        <span :class="account.frozen ? 'inactive' : 'active'">
          {{ account.frozen ? 'Frozen' : 'Active' }}
        </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="showAddModal" class="modal-overlay">
            <div class="modal-wrapper">
              <div class="modal-header">
                <h3>Add a new account</h3>
                <p class="subtitle">Fill all required fields to add a new user account</p>
                <button class="modal-close" @click="showAddModal = false">
                  <i class="fa-solid fa-times"></i>
                </button>
              </div>

              <div class="modal-body">
                <form @submit.prevent="handleAccountSubmit">
                  <div class="form-grid">
                    <div class="form-column">
                      <div class="input-field">
                        <label for="username">Username</label>
                        <input id="username" v-model="newAccount.username" type="text" class="input" required>
                      </div>

                      <div class="input-field">
                        <label for="displayName">Display Name</label>
                        <input id="displayName" v-model="newAccount.displayName" type="text" class="input" required>
                      </div>

                      <div class="input-field">
                        <label for="password">Password</label>
                        <input id="password" v-model="newAccount.password" type="password" class="input" required>
                      </div>

                      <div class="input-field">
                        <label for="confirmPassword">Confirm Password</label>
                        <input id="confirmPassword" v-model="newAccount.confirmPassword" type="password" class="input" required>
                      </div>
                    </div>

                    <div class="form-column">
                      <div class="input-field">
                        <label for="role">Role</label>
                        <select id="role" v-model="newAccount.role" class="select" required>
                          <option value="">Select a role</option>
                          <option v-for="role in roles" :key="role" :value="role">
                            {{ role }}
                          </option>
                        </select>
                      </div>

                      <div class="input-field">
                        <label for="campus">Campus</label>
                        <select id="campus" v-model="newAccount.campus" class="select" required>
                          <option value="">Select a campus</option>
                          <option v-for="campus in campuses" :key="campus" :value="campus">
                            {{ campus }}
                          </option>
                        </select>
                      </div>

                      <div class="input-field">
                        <label for="status">Status</label>
                        <select id="status" v-model="newAccount.status" class="select" required>
                          <option value="">Select status</option>
                          <option value="active">Active</option>
                          <option value="frozen">Frozen</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="modal-actions">
                    <button type="button" class="btn btn-cancel" @click="showAddModal = false">
                      <span>Cancel</span>
                    </button>
                    <button type="submit" class="btn btn-submit">
                      <span>Add Account</span>
                      <i class="fa-solid fa-plus" style="color: #ffffff;"></i>
                    </button>
                  </div>
                </form>
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
const newAccount = ref({
  username: '',
  displayName: '',
  password: '',
  confirmPassword: '',
  role: '',
  campus: '',
  status: 'active'
});


const roles = ref([])
const statuses = ref(['Active', 'Frozen'])

async function fetchRoles() {
  try {
    const response = await fetch(`${apiurl}query/role`, {
      method: "GET",
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    });

    const data = await response.json();
    if (data.res) {
      roles.value = data.res.map(role => role.roleName);
    }
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
}

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

async function handleAccountSubmit() {
  if (newAccount.value.password !== newAccount.value.confirmPassword) {
    await Swal.fire({
      title: "Password Mismatch",
      text: "The passwords do not match",
      icon: "error",
      iconColor: "#FF5252",
      background: "#2c2c3a",
      color: "#fff"
    });
    return;
  }

  if (newAccount.value.password.length < 8) {
    await Swal.fire({
      title: "Weak Password",
      text: "Password must be at least 8 characters long",
      icon: "error",
      iconColor: "#FF5252",
      background: "#2c2c3a",
      color: "#fff"
    });
    return;
  }

  try {
    const formData = new FormData();
    formData.append('UUID', newAccount.value.username);
    formData.append('name', newAccount.value.displayName);
    formData.append('passwd', newAccount.value.password);
    formData.append('role', newAccount.value.role);
    formData.append('campus', newAccount.value.campus);
    formData.append('frozen', newAccount.value.status === 'frozen' ? '1' : '0');

    const response = await fetch(apiurl + 'signup', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
      credentials: 'include'
    });

    const data = await response.json();
    if (data.account_created) {
      await Swal.fire({
        title: "Success!",
        text: "Account created successfully",
        icon: "success",
        iconColor: "#4A90E2",
        background: "#2c2c3a",
        color: "#fff"
      });

      newAccount.value = {
        username: '',
        displayName: '',
        password: '',
        confirmPassword: '',
        role: '',
        campus: '',
        status: 'active'
      };

      showAddModal.value = false;
      await fetchAccounts();
    } else {
      throw new Error(data.error || "Failed to create account");
    }
  } catch (error) {
    await Swal.fire({
      title: "Error!",
      text: error.message || "An error occurred while creating the account",
      icon: "error",
      iconColor: "#FF5252",
      background: "#2c2c3a",
      color: "#fff"
    });
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
    getCampuses(),
    fetchRoles()
  ]);
  updateFilterOptions(filterType.value);
  checkAdminAccess();
});
</script>

<style scoped>
.account-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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
  justify-content: center;
  align-items: center;
  gap: 2rem;
  width: 100%;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-wrapper {
  display: flex;
  gap: 1rem;
  align-items: center;
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
  .filter-actions-wrapper {
    flex-direction: column;
    gap: 1rem;
  }

  .btn-wrapper, .filter-wrapper {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .filter-wrapper .input-field {
    min-width: 150px;
  }
}

.input-field {
  margin-bottom: 0;
}

.btn {
  display: flex;
  height: 44px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
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

.btn, .select {
  height: 44px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
  backackground: rgba(74, 144, 226, 0.1);
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

.account-info h4 {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
}

.account-item.selected .account-info h4 {
  color: #4A90E2;
  font-weight: 600;
}

.meta {
  display: flex;
  gap: 0.3rem;
  flex-direction: column;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.meta span {
  transition: color 0.3s ease;
}

.status-info {
  margin-top: 0.5rem;
}

.status-info span {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
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
  height: 44px;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
  padding-top: 5rem;
}

.modal-wrapper {
  background: rgba(44, 44, 58, 0.95);
  border-radius: 12px;
  padding: 2rem;
  width: 800px;
  max-width: 95%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header {
  margin-bottom: 1.5rem;
  position: relative;
}

.modal-header h3 {
  color: white;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.modal-header .subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.modal-close {
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s;
}

.modal-close:hover {
  color: white;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 1.5rem;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-submit {
  background: #4A90E2;
}

.btn-submit:hover {
  background: #3a7bc8;
}

.modal-body .input-field label {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  text-align: left;
}

.modal-body .input,
.modal-body .select {
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.modal-body .input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.modal-body .input:hover,
.modal-body .select:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.modal-body .input:focus,
.modal-body .select:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.modal-body .select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

.modal-body .select option {
  background-color: #2c2c3a;
  color: white;
}


.input-field {
  position: relative;
  margin-bottom: 1.2rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-submit {
  background: #4A90E2;
  color: white;
}

.btn-submit:hover {
  background: #3a7bc8;
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
  cursor: pointer;
  position: relative;
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

.account-info h4 {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 1.1rem;
}

.account-item.selected .account-info h4 {
  color: #4A90E2;
  font-weight: 600;
}

.meta {
  display: flex;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
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
  cursor: pointer;
  position: relative;
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

.account-info h4 {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 1.1rem;
}

.meta {
  display: flex;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
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
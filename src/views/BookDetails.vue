<template>
  <div class="book-detail-container">
    <Background/>

    <button type="button" class="go-back-btn" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>

    <section id="detail">
      <div class="container">
        <div class="content-wrapper">

          <div class="detail-content">
            <div class="book-cover">
              <img v-bind:alt="book.booktitle+'\'s Cover'" v-if="book.bookcover" v-bind:src="covers_url+book.bookcover"/>
              <img v-bind:alt="book.booktitle+'\'s Cover PLACEHOLDER'" v-else src="../assets/bookcov.png"/>
            </div>

            <div class="book-header">
              <h1 class="book-title">{{ book.booktitle }}</h1>
              <div class="book-description">
                <p>Serial N°: {{ book.serialnum }}</p>
                <p>Description: {{ book.description }}</p>
              </div>
            </div>
          </div>

          <div class="separator"></div>

          <div class="rent-section">
            <div class="rent-controls" v-if="showRentControls">
              <button class="btn" type="submit" @click="openBorrowModal">
                <i class="fa-solid fa-cart-plus" style="color: #ffffff;"></i>
                <span>borrow</span>
              </button>

              <button
                  class="btn"
                  type="button"
                  @click="openReturnModal"
                  :disabled="isProcessingReturn"
              >
                <i class="fa-solid fa-arrow-rotate-left" style="color: #ffffff;"></i>
                <span>{{ isProcessingReturn ? 'Processing...' : 'take back' }}</span>
              </button>

            </div>

            <div class="book-info">
              <div class="info-item">
                <span class="info-label">Authors:</span>
                <span class="info-value" v-for="author in book.authors" v-if="book.authors && !loading">{{ author || 'Unknown' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Publisher:</span>
                <span class="info-value">{{ book.publisher || 'Unknown' }}</span>
              </div>


              <div class="info-item">
                <span class="info-label">Publication Year:</span>
                <span class="info-value">{{ book.bookreleaseyear || 'Unknown' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Category:</span>
                <span class="info-value">{{ book.category + ' - ' + book.categoryName || 'Unknown' }}</span>
                <span class="info-label">Type:</span>
                <span class="info-value">{{ book.type || 'Unknown' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Languages:</span>
                <span class="info-value" v-for="lang in book.langs" v-if="book.langs && !loading">{{ lang || 'Unknown' }}</span>
              </div>


              <div class="info-item">
                <span class="info-label">Available Copies:</span>
                <span class="info-value" v-for="stock in book.stock" v-if="book.stock && !loading"><span :class="{highlight : userCampus === stock.campus}">{{ stock.campus+': '+stock.stock || 'Unknown: Unknown' }}</span> </span>
              </div>
            </div>
          </div>
          <div v-if="loading" class="loading-spinner">
            <svg viewBox="25 25 50 50">
              <circle r="20" cy="50" cx="50"></circle>
            </svg>
          </div>
        </div>
      </div>
    </section>
    <div v-if="showBorrowModal" class="modal-overlay">
      <div class="modal-wrapper">
        <div class="modal-header">
          <h3>{{ currentStep === 1 ? 'Select User' : 'Select Duration' }}</h3>
          <button class="modal-close" @click="closeBorrowModal">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div v-if="currentStep === 1">
            <div v-if="isLoadingUsers" class="loading">
              <svg viewBox="25 25 50 50" class="spinner">
                <circle r="20" cy="50" cx="50"></circle>
              </svg>
            </div>

            <div v-else-if="eligibleUsers.length === 0" class="empty">
              No eligible users found
            </div>

            <div v-else class="users-list">
              <div
                  class="user-item"
                  v-for="user in eligibleUsers"
                  :key="user['UUID']"
                  :class="{ selected: selectedUser?.['UUID'] === user['UUID'] }"
                  @click="selectUser(user)"
              >
                <div class="user-info">
                  <div class="selected-indicator" v-if="selectedUser?.['UUID'] === user['UUID']">
                    <i class="fa-solid fa-check"></i>
                  </div>
                  <div class="uuid-display">
                    <span class="uuid-label">UUID:</span>
                    <span class="uuid-value">{{ user['UUID'] }}</span>
                  </div>
                  <div class="display-name">
                    <span class="name-label">Name:</span>
                    <span class="name-value">{{ user.displayname }}</span>
                  </div>
                  <div class="meta">
                    <div class="meta-item">
                      <span class="meta-label">Role:</span>
                      <span class="meta-value">{{ user.role }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Campus:</span>
                      <span class="meta-value">{{ user.campus }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="duration-selection">
            <div class="input-field">
              <label for="duration">Duration (days):</label>
              <select id="duration" v-model="selectedDuration" class="select">
                <option v-for="days in durationOptions" :key="days" :value="days">
                  {{ days }} days
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button
              v-if="currentStep === 2"
              type="button"
              class="btn btn-back"
              @click="currentStep = 1"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>Back</span>
          </button>

          <button
              v-if="currentStep === 1 && selectedUser"
              type="button"
              class="btn btn-next"
              @click="currentStep = 2"
          >
            <span>Next</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>

          <button
              v-if="currentStep === 2"
              type="button"
              class="btn btn-submit"
              @click="processBorrow"
              :disabled="isProcessing"
          >
            <span v-if="!isProcessing">Borrow Publication</span>
            <span v-else>Processing...</span>
          </button>

          <button
              type="button"
              class="btn btn-cancel"
              @click="closeBorrowModal"
          >
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="showReturnModal" class="modal-overlay">
      <div class="modal-wrapper">
        <div class="modal-header">
          <h3>Select User to Return</h3>
          <button class="modal-close" @click="showReturnModal = false">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div v-if="isLoadingUsers" class="loading">
            <svg viewBox="25 25 50 50" class="spinner">
              <circle r="20" cy="50" cx="50"></circle>
            </svg>
          </div>

          <div v-else-if="borrowedUsers.length === 0" class="empty">
            No users have borrowed this book
          </div>

          <div v-else class="users-list">
            <div
                class="user-item"
                v-for="user in borrowedUsers"
                :key="user['UUID']"
                :class="{ selected: selectedReturnUser?.['UUID'] === user['UUID'] }"
                @click="selectReturnUser(user)"
            >
              <div class="user-info">
                <div class="selected-indicator" v-if="selectedReturnUser?.['UUID'] === user['UUID']">
                  <i class="fa-solid fa-check"></i>
                </div>
                <div class="uuid-display">
                  <span class="uuid-label">UUID:</span>
                  <span class="uuid-value">{{ user['UUID'] }}</span>
                </div>
                <div class="display-name">
                  <span class="name-label">Name:</span>
                  <span class="name-value">{{ user.displayname }}</span>
                </div>
                <div class="meta">
                  <div class="meta-item">
                    <span class="meta-label">Borrow Date:</span>
                    <span class="meta-value">{{ user.rentdate }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button
              type="button"
              class="btn btn-submit"
              @click="processReturn"
              :disabled="!selectedReturnUser || isProcessingReturn"
          >
            <span v-if="!isProcessingReturn">Confirm Return</span>
            <span v-else>Processing...</span>
          </button>

          <button
              type="button"
              class="btn btn-cancel"
              @click="showReturnModal = false"
          >
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Background from "../components/background.vue"
import router from "../router";
import Swal from 'sweetalert2';

export default defineComponent({
  components: { Background },
  props: {
    serialnum: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      book: {},
      userCampus: "",
      covers_url: pubURL,
      loading: true,
      userRole: null,
      showBorrowModal: false,
      currentStep: 1,
      selectedUser: null,
      selectedDuration: 7,
      durationOptions: [7, 14, 21, 30],
      users: [],
      isLoadingUsers: false,
      isProcessing: false,
      isProcessingReturn: false,
      showReturnModal: false,
      borrowedUsers: [],
      selectedReturnUser: null,
      userPermissions: {}
    }
  },

  async beforeMount() {
    await this.fetchUserData();
  },
  computed: {
    showRentControls() {
      return this.userPermissions.manage_stock ||
          this.userPermissions.admin ||
          this.userPermissions.staff;
    },
    eligibleUsers() {
      return this.users.filter(user =>
          ['STUDENT', 'PROFESSOR'].includes(user.role.toUpperCase()) &&
          !user.frozen
      );
    }
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await fetch(`${apiurl}me`, {
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const userData = await response.json();

        this.userRole = userData.user?.role;
        this.userCampus = userData.user?.campus;
        this.userPermissions = userData.user?.perms || {};

      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    },
    goBack() {
      router.push('/');
    },
    openBorrowModal() {
      this.showBorrowModal = true;
      this.currentStep = 1;
      this.selectedUser = null;
      this.fetchEligibleUsers();
    },

    closeBorrowModal() {
      this.showBorrowModal = false;
    },
    selectUser(user) {
      this.selectedUser = this.selectedUser?.UUID === user.UUID ? null : user;
    },
    async fetchEligibleUsers() {
      this.isLoadingUsers = true;
      try {
        const response = await fetch(`${apiurl}query/account`, {
          method: "GET",
          headers: { 'Accept': 'application/json' },
          credentials: 'include'
        });

        const data = await response.json();
        if (data.res) {
          this.users = data.res;
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch users",
          icon: "error",
          iconColor: "#FF5252",
          background: "#2c2c3a",
          color: "#fff"
        });
      } finally {
        this.isLoadingUsers = false;
      }
    },
    async processBorrow() {
      if (!this.selectedUser || !this.selectedDuration) return;

      this.isProcessing = true;

      try {
        const response = await fetch(`${apiurl}borrow?uuid=${encodeURIComponent(this.selectedUser.UUID)}&serialnum=${encodeURIComponent(this.serialnum)}&duration=${this.selectedDuration}`, {
          method: "GET",
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          await Swal.fire({
            title: "Success!",
            text: "Book borrowed successfully",
            icon: "success",
            iconColor: "#4A90E2",
            background: "#2c2c3a",
            color: "#fff"
          });
          this.closeBorrowModal();
          this.fetchBookDetails();
        } else {
          throw new Error(data.error || "Failed to borrow book");
        }
      } catch (error) {
        await Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          iconColor: "#FF5252",
          background: "#2c2c3a",
          color: "#fff"
        });
      } finally {
        this.isProcessing = false;
      }
    },


    async fetchBookDetails() {
      try {
        const response = await fetch(apiurl + `query/book/${this.serialnum}`, {
          method: "GET",
          headers: { 'Accept': 'application/json' },
          credentials: 'include'
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (data.res) {
          const foundBook = data.res.find(book => book.serialnum === this.serialnum);
          if (foundBook) {
            this.book = foundBook;
          }
        }

        if (data.user) {
          this.userCampus = data.user.campus;
          if (data.user.role && !this.userRole) {
            this.userRole = data.user.role;
          }
        }

      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },
    async openReturnModal() {
      this.isLoadingUsers = true;
      this.showReturnModal = true;
      try {
        const response = await fetch(`${apiurl}query/inventory?serialnum=${encodeURIComponent(this.serialnum)}`, {
          method: "GET",
          credentials: 'include'
        });

        const data = await response.json();
        if (data.res) {
          this.borrowedUsers = data.res;
          if (this.borrowedUsers.length === 1) {
            this.selectedReturnUser = this.borrowedUsers[0];
          }
        }
      } catch (error) {
        console.error("Error fetching borrowed users:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch borrowed users",
          icon: "error",
          iconColor: "#FF5252",
          background: "#2c2c3a",
          color: "#fff"
        });
      } finally {
        this.isLoadingUsers = false;
      }
    },

    selectReturnUser(user) {
      this.selectedReturnUser = this.selectedReturnUser?.UUID === user.UUID ? null : user;
    },

    async processReturn() {
      if (!this.selectedReturnUser) {
        await Swal.fire({
          title: "No user selected",
          text: "Please select a user first",
          icon: "warning",
          iconColor: "#FFA726",
          background: "#2c2c3a",
          color: "#fff"
        });
        return;
      }

      this.isProcessingReturn = true;

      try {
        const response = await fetch(
            `${apiurl}return?uuid=${encodeURIComponent(this.selectedReturnUser.UUID)}&serialnum=${encodeURIComponent(this.serialnum)}`,
            {
              method: "GET",
              credentials: 'include'
            }
        );

        const data = await response.json();

        if (response.ok) {
          await Swal.fire({
            title: "Success!",
            text: "Book returned successfully",
            icon: "success",
            iconColor: "#4CAF50",
            background: "#2c2c3a",
            color: "#fff"
          });
          this.fetchBookDetails();
          this.showReturnModal = false;
        } else {
          throw new Error(data.error || "Failed to return book");
        }
      } catch (error) {
        await Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          iconColor: "#FF5252",
          background: "#2c2c3a",
          color: "#fff"
        });
      } finally {
        this.isProcessingReturn = false;
      }
    }
  },
  mounted() {
    this.fetchBookDetails();
  }
});
</script>

<style scoped>
.highlight {
  color: green;
}
.book-detail-container {
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
  padding: 2rem;
  width: 1100px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.book-header {
  flex: 1;
}


.book-title {
  font-size: 2.2rem;
  color: white;
  text-align: left;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin-left: 0;
}

.book-description {
  margin-top: 1.5rem;
}

.book-description p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.7;
  text-align: justify;
  margin: 0;
}

#detail {
  padding: 8rem 0;
  display: flex;
  align-items: center;
}

.detail-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.book-cover {
  width: 240px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.book-cover img {
  width: 100%;
  height: auto;
  display: block;
}

.publication-description p {
  color: white;
  font-size: 1rem;
  line-height: 1.6;
  text-align: justify;
  margin: 0;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
}

.loading-spinner svg {
  width: 3.25em;
  transform-origin: center;
  animation: rotate4 2s linear infinite;
}

.loading-spinner circle {
  fill: none;
  stroke: hsl(214, 97%, 59%);
  stroke-width: 2;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash4 1.5s ease-in-out infinite;
}

label {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #4A90E2;
  width: 200px ;
  color: white;
  font-weight: 600;
  padding: 0.8rem 2rem;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  border: none;
  transition: all 0.3s ease;
}

.btn i{
  margin-left: 5px;
}

.btn:hover {
  background: #3a7bc8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.btn:active {
  transform: translateY(0);
}

.separator {
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 1.5rem 0;
}

.rent-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  margin-top: 1.5rem;
}

label {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
}

.rent-section {
  display: flex;
  gap: 3rem;
  margin-top: 1.5rem;
}

.book-info {
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  gap: 1rem;
  width: 100%;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.info-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: white;
  font-size: 1rem;
  font-weight: 500;
}

.go-back-btn {
  position: fixed;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-wrapper {
  position: relative;
  background: rgba(44, 44, 58, 0.95);
  border-radius: 16px;
  padding: 2rem;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close:hover {
  color: white;
}

.modal-body p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}

.go-back-btn i {
  font-size: 0.8rem;
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

.user-info h4 {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 1.1rem;
}

.modal-wrapper {
  width: 600px;
  max-width: 95%;
}

.users-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1rem;
  color: white ;
}

.user-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-item:hover {
  background: rgba(74, 144, 226, 0.1);
}

.user-item.selected {
  background: rgba(74, 144, 226, 0.2);
  border-left: 3px solid #4A90E2;
}

.user-info {
  position: relative;
}

.selected-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: #4A90E2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
}

.duration-selection {
  padding: 1.5rem 0;
  animation: fadeIn 0.3s ease-out;
}

.duration-selection .input-field {
  margin-bottom: 1.5rem;
}

.duration-selection label {
  display: block;
  margin-bottom: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.duration-selection .select {
  width: 100%;
  padding: 0.85rem 1.25rem;
  border-radius: 10px;
  border: 1px solid rgba(74, 144, 226, 0.5);
  background: rgba(44, 44, 58, 0.8);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234A90E2'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
}

.duration-selection .select:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
  transform: translateY(-2px);
}

.duration-selection .select:hover {
  border-color: rgba(74, 144, 226, 0.8);
}

.duration-selection .select option {
  background-color: #2c2c3a;
  color: white;
  padding: 0.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.duration-option {
  display: inline-block;
  margin: 0 0.5rem 0.5rem 0;
}

.duration-option input[type="radio"] {
  display: none;
}

.duration-option label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.3);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
}

.duration-option input[type="radio"]:checked + label {
  background: rgba(74, 144, 226, 0.2);
  border-color: #4A90E2;
  color: white;
  box-shadow: 0 0 0 1px #4A90E2;
}

.duration-option label:hover {
  background: rgba(74, 144, 226, 0.1);
  transform: translateY(-2px);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-next {
  background: #4A90E2;
}

.btn-next:hover {
  background: #3a7bc8;
}

.btn-back {
  background: rgba(255, 255, 255, 0.1);
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-submit {
  background: #4A90E2;
}

.btn-submit:hover:not(:disabled) {
  background: #3a7bc8;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.empty {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  padding: 2rem;
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

@keyframes rotate4 {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash4 {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dashoffset: -125px;
  }
}
</style>
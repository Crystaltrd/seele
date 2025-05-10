<template>
  <div class="history-container">
    <Background/>

    <div class="admin-btn-container" v-if="showAdminButton">
      <button type="button" class="admin-btn" @click="goToAdmin">
        <i class="fas fa-cog"></i>
      </button>
    </div>

    <section id="history">
      <div class="container">
        <div class="content-wrapper">
          <h3 class="section-heading">History</h3>
          <div class="history-grid" v-if="!isAuthenticated">
            <img alt="teto-gif" src="../assets/teto-tetoris.gif">
            <p class="subtitle"><strong>Oops !</strong> you have du log in to access this option</p>
            <router-link to="/login" class="btn" >Login now !</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import {defineComponent} from "vue";
import Background from "../components/background.vue";
import {isAuthenticated} from "../authStore";


export default defineComponent({
  computed: {
    isAuthenticated() {
      return isAuthenticated.value;
    }
  },
  components: {Background},
  data(){
    return {
      showAdminButton: false,
    };
  },
  methods:{goToAdmin() {
      this.$router.push('/admin');
    },
    checkAdminAccess() {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userRole = localStorage.getItem('userRole');
      this.showAdminButton = isAuthenticated && ["ADMIN", "STAFF", "SHELF MANAGER", "LIBRARIAN"].includes(userRole);
    },
  },
  beforeMount() {
    this.checkAdminAccess();
  }
})
</script>

<style scoped>
.history-container {
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

#history {
  padding: 6rem 0;
  display: flex;
  align-items: center;
}

.history-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
  scrollbar-width: none;
  justify-content: center;
  flex-wrap: wrap;
  background: rgba(44, 44, 58, 0.1);
  backdrop-filter: blur(3px);
  border-radius: 20px;
  width: 600px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  margin: 0 auto 2rem;
}

.history-grid::-webkit-scrollbar {
  display: none;
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}
.btn {
  display: block;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #4A90E2;
  width: fit-content;
  color: white;
  font-weight: 700;
  padding: 0.8rem 2rem;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  border: none;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn:hover, .btn:focus{
  background: #3a7bc8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
  text-decoration: none;
}

.btn:active {
  transform: translateY(0);
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
  .section-heading {
    font-size: 1.8rem;
  }

  #history {
    padding: 3rem 0;
  }

  .history-grid {
    width: 95%;
    padding: 1.5rem 0.5rem;
  }

  .btn {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .section-heading {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  #history {
    padding: 2rem 0;
  }

  .subtitle {
    font-size: 0.8rem;
    padding: 0 0.5rem;
  }

  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
  }
}
</style>

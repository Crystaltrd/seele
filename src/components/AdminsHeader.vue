<template>
  <header class="container-fluid">
    <div class="header-content row align-items-center">

      <div class="col-3 d-flex align-items-center">
        <router-link to="/">
          <img alt="LOGO" id="logo" src="../assets/univLogo.png">
        </router-link>
      </div>

      <nav class="col-6 d-flex justify-content-center desktop-nav">
        <ul class="nav-links">
          <li>
            <router-link to="/home" exact-active-class="active">General Dashbord</router-link>
          </li>
          <li>
            <router-link to="/filter" exact-active-class="active">Account management</router-link>
          </li>
          <li>
            <router-link to="/history" exact-active-class="active">Publication management</router-link>
          </li>
          <li>
            <router-link to="/about" exact-active-class="active">Campus management</router-link>
          </li>
        </ul>
      </nav>

      <button class="hamburger-btn" @click="toggleMobileMenu" v-if="showMobileMenu">
        <i class="fas" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
      </button>

      <div class="col-3 d-flex justify-content-end user-actions">
        <button class="search-icon-mobile" @click="toggleSearchModal" v-if="showMobileMenu">
          <i class="fas fa-search"></i>
        </button>

        <router-link to="/login" class="btn" v-if="!isAuthenticated">Login</router-link>
        <router-link to="/signup" class="btn" id="signup" v-if="!isAuthenticated">Signup</router-link>

        <div class="user-profile" v-else @click="toggleDropdown">
          <i class="fas fa-user-circle user-icon"></i>
          <span class="username">{{ userDisplayName }}</span>
          <div class="dropdown-menu" v-show="showDropdown" @click.stop>
            <ul>
              <li @click="handleLogout">
                <i class="fas fa-sign-out-alt"></i> Logout
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mobile-menu-overlay" v-if="mobileMenuOpen && showMobileMenu" @click="toggleMobileMenu"></div>
      <div class="mobile-menu" v-if="mobileMenuOpen && showMobileMenu">
        <ul>
          <li @click="toggleMobileMenu">
            <router-link to="/home" exact-active-class="active">General Dashbord</router-link>
          </li>
          <li @click="toggleMobileMenu">
            <router-link to="/filter" exact-active-class="active">Account management</router-link>
          </li>
          <li @click="toggleMobileMenu">
            <router-link to="/history" exact-active-class="active">Publication management</router-link>
          </li>
          <li @click="toggleMobileMenu">
            <router-link to="/about" exact-active-class="active">Campus management</router-link>
          </li>
        </ul>
      </div>

      <div class="search-modal-overlay" v-if="searchModalOpen" @click="toggleSearchModal"></div>
      <div class="search-modal" v-if="searchModalOpen">
        <form class="form">
          <input class="input" placeholder="Search" required="" type="text" autofocus>
          <button type="submit">
            <i class="fas fa-search"></i>
          </button>
        </form>
        <button class="close-search" @click="toggleSearchModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { isAuthenticated, setAuth, userDisplayName } from '../authStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const showDropdown = ref(false);
const mobileMenuOpen = ref(false);
const searchModalOpen = ref(false);
const windowWidth = ref(window.innerWidth);

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth);
});

const showMobileMenu = computed(() => windowWidth.value < 500);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (searchModalOpen.value) searchModalOpen.value = false;
};

const toggleSearchModal = () => {
  searchModalOpen.value = !searchModalOpen.value;
  if (mobileMenuOpen.value) mobileMenuOpen.value = false;
};

const handleLogout = async () => {
  try {
    const response = await fetch(apiurl + 'deauth', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include'
    });

    const rawText = await response.text();
    console.log("Response text:", rawText);

    try {
      const jsonResponse = JSON.parse(rawText);

      if (jsonResponse.status === 'success' || jsonResponse.disconnected) {
        setAuth(false);
        await router.push('/');
        window.location.reload();
      } else {
        console.error('Logout failed :', jsonResponse.message);
        setAuth(false);
        await router.push('/');
      }
    } catch (error) {
      console.error('Network error :', error);
      setAuth(false);
      await router.push('/');
    } finally {
      showDropdown.value = false;
    }
  } catch (error) {
    console.error('Outer try error:', error);
    setAuth(false);
    await router.push('/');
    showDropdown.value = false;
  }
};
</script>

<style scoped>
header {
  position: fixed;
}

.container-fluid {
  display: flex;
  padding: 15px 40px;
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1200px;
  background: linear-gradient(135deg, #1e1e28 0%, #2c2c3a 100%);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  height: 65px;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

#logo {
  width: 150px;
  height: auto;
  transition: all 0.3s ease;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 25px;
}

.nav-links li {
  display: inline;
}

.nav-links li a {
  text-decoration: none;
  color: white;
  font-weight: 850;
  font-size: 14px;
  transition: color 0.3s ease;
  padding: 5px 10px;
}

.nav-links li a:hover {
  color: #4A90E2;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form button {
  border: none;
  background: none;
  color: #8b8ba7;
}

.form {
  --timing: 0.3s;
  --width-of-input: 300px;
  --height-of-input: 28px;
  --border-height: 2px;
  --input-bg: #fff;
  --border-color: #4A90E2;
  --border-radius: 30px;
  --after-border-radius: 1px;
  position: relative;
  width: var(--width-of-input);
  height: var(--height-of-input);
  display: flex;
  align-items: center;
  padding-inline: 0.8em;
  border-radius: var(--border-radius);
  transition: border-radius 0.5s ease;
  background: var(--input-bg, #fff);
}

.input {
  font-size: 0.85rem;
  background-color: transparent;
  width: 100%;
  height: 100%;
  padding-inline: 0.2em;
  padding-block: 0.7em;
  border: none;
}

.form:before {
  content: "";
  position: absolute;
  transform: scaleX(0);
  transform-origin: center;
  width: 100%;
  height: var(--border-height);
  left: 0;
  bottom: 0;
  border-radius: 1px;
  transition: transform var(--timing) ease;
}

input:focus {
  outline: none;
}

.form:focus-within:before {
  transform: scale(1);
}

input:not(:placeholder-shown) ~ {
  opacity: 1;
  visibility: visible;
}

.form svg {
  width: 17px;
  margin-top: 3px;
}

.btn {
  background: transparent;
  color: #d5dbdb;
  padding: 5px 20px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 850;
  text-decoration: none;
  transition: color 0.4s ease;
  margin-top: 30px;
  margin-bottom: 30px;
  border: 1px solid #d5dbdb;
  border-radius: 100px;
  margin-left: 5px;
}

#signup {
  margin-left: 2px;
}

.btn:hover {
  border: 1px solid #4A90E2;
  color: #4A90E2;
  transition: color 0.4s ease;
}

.user-profile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 15px;
  color: white;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  transition: background-color 0.3s ease;
}

.user-icon {
  font-size: 25px;
  color: #4A90E2;
}

.user-profile:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: linear-gradient(135deg, #1e1e28 0%, #2c2c3a 100%);
  border-radius: 8px;
  padding: 10px 0;
  min-width: 150px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dropdown-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li {
  padding: 8px 15px;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s ease;
}

.dropdown-menu li:hover {
  color: #4A90E2;
}

.dropdown-menu i {
  width: 16px;
  text-align: center;
}

.username {
  font-weight: 600;
  font-size: 14px;
}

::v-deep(.nav-links li .active) {
  color: #4A90E2;
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 12px 20px;
    width: 95%;
  }

  #logo {
    width: 120px;
  }

}

@media (max-width: 500px) {
  .container-fluid {
    padding: 10px 15px;
    height: 60px;
  }

  #logo {
    width: 100px;
  }

  .username {
    display: none;
  }

  .btn {
    padding: 4px 12px;
    font-size: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

.hamburger-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  z-index: 1001;
  margin-left: auto;
  padding: 5px;
}

@media (max-width: 500px) {
  .hamburger-btn {
    display: block;
  }
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 998;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  max-width: 300px;
  height: 100vh;
  background: linear-gradient(135deg, #1e1e28 0%, #2c2c3a 100%);
  z-index: 999;
  padding: 80px 20px 20px;
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.mobile-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mobile-menu li a {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  display: block;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.mobile-menu li a:hover,
.mobile-menu li a.active {
  color: #4A90E2;
  background-color: rgba(255, 255, 255, 0.1);
}

.search-icon-mobile {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  margin-right: 10px;
  display: none;
  cursor: pointer;
}

@media (max-width: 500px) {
  .search-icon-mobile {
    display: block;
  }
}

.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 998;
}

.search-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background: linear-gradient(135deg, #1e1e28 0%, #2c2c3a 100%);
  padding: 30px;
  border-radius: 15px;
  z-index: 999;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.search-modal .form {
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 30px;
}

.search-modal .input {
  font-size: 1rem;
  color: #333;
}

.close-search {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
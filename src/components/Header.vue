<template>
  <header class="container-fluid">
    <div class="header-content row align-items-center">

      <div class="col-3 d-flex align-items-center">
        <router-link to="/">
          <img alt="LOGO" id="logo" src="../assets/univLogo.png">
        </router-link>
      </div>

      <nav class="col-6 d-flex justify-content-center">
        <ul class="nav-links">
          <li><router-link to="/home" exact-active-class="active">Home</router-link></li>
          <li><router-link to="/filter" exact-active-class="active">Advanced Search</router-link></li>
          <li><router-link to="/history" exact-active-class="active">History</router-link></li>
          <li><router-link to="/about" exact-active-class="active">About</router-link></li>
          <li><router-link to="/help" exact-active-class="active">Help</router-link></li>
        </ul>
      </nav>

      <div class="col-3 d-flex justify-content-end user-actions">
        <form class="form">
          <button>
            <svg aria-labelledby="search" fill="none" height="16" role="img" width="17"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="1.333"></path>
            </svg>
          </button>

          <input class="input" placeholder="Search" required="" type="text">
          <button class="reset" type="reset">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </form>

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
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import {isAuthenticated, sessionID, setAuth, userDisplayName} from '../authStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const showDropdown = ref(false);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleLogout = async () => {
  try {
/*FIXME*/
    console.log(localStorage.getItem('sessionID'))
    const response = await fetch(apiurl + 'deauth.cgi', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/x-www-form-urlencoded",
      },
        body: new URLSearchParams({ sessionID: localStorage.getItem('sessionID') }),
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
header{
  position: fixed ;
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

.reset {
  border: none;
  background: none;
  opacity: 0;
  visibility: hidden;
}

input:not(:placeholder-shown) ~ .reset {
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

.btn a {
  text-decoration: none;
  color: white;
  transition: color 0.3s ease;
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
</style>

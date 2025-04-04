<template>
  <div class="login-container">
    <Background />

    <div class="wrapper">
      <form @submit.prevent="handleLogin">
        <img id="logo" src="../assets/univLogo.png" alt="LOGO" />
        <h2>Welcome back !</h2>

        <div class="input-field">
          <i class="fas fa-user"></i>
          <input v-model="identifier" type="text" required placeholder=" " />
          <label>Enter your identifier</label>
        </div>

        <div class="input-field">
          <i class="fas fa-lock"></i>
          <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder=" "
          />
          <img
              :src="showPassword ? visibleIcon : hiddenIcon"
              class="pass-icon"
              @click="togglePassword"
              alt="Toggle Password"
          />
          <label>Enter your password</label>
        </div>

        <div class="forget">
          <label for="remember">
            <input id="remember" type="checkbox" v-model="rememberMe" />
            <p>Keep me signed in</p>
          </label>
          <a href="#">Forget password?</a>
        </div>

        <button class="btn" type="submit">Log in</button>

        <div class="register">
          <p>Don't have an account? <router-link to="">Sign Up</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import Background from "../components/backGround.vue";
import visibleIcon from "../assets/visible.png";
import hiddenIcon from "../assets/hidden.png";

export default {
  name: "Login",
  components: { Background },
  setup() {
    const identifier = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const rememberMe = ref(false);

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const handleLogin = async () => {
      try {
        const queryParams = new URLSearchParams({
          UUID: identifier.value,
          passwd: password.value,
        });

        if (rememberMe.value) {
          queryParams.append('remember', 'true');
        }

        const response = await fetch(`/api/auth.cgi?${queryParams.toString()}`, {
          method: "GET",
          credentials: "include"
        });

        const data = await response.json();
        data.authenticated = undefined;

        console.log("Login failed :", data.error);

      } catch (error) {
        console.error("Error in API :", error);
      }
    };

    return { identifier, password, showPassword, togglePassword, handleLogin, rememberMe, visibleIcon, hiddenIcon };
  },
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

.wrapper {
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(9px);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  -webkit-backdrop-filter: blur(9px);
  max-height: 500px;
}

form {
  display: flex;
  flex-direction: column;
}

#logo {
  width: 140px;
  height: auto;
  margin-bottom: 5px;
  display: block;
  align-self: center;
}

h2 {
  font-size: 2.1rem;
  margin-bottom: 5px;
  color: #FFFFFF;
}

.input-field {
  position: relative;
  border-bottom: 2px solid #4A90E2;
  margin: 12px 0;
}

.input-field i {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #4A90E2;
}

.input-field label {
  position: absolute;
  top: 50%;
  left: 40px;
  transform: translateY(-50%);
  color: #FFFFFF;
  font-size: 16px;
  pointer-events: none;
  transition: 0.15s ease;
}

.input-field input {
  width: 90%;
  height: 35px;
  padding-left: 40px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 15px;
  color: #FFFFFF;
}

.input-field input:focus {
  border-bottom: 1px solid #4A90E2;
}

.input-field input:focus ~ label, .input-field input:focus ~ label {
  font-size: 0.9rem;
  top: 10px;
  transform: translateY(-120%);
  color: #4A90E2;
}

.input-field input:focus ~ label, .input-field input:not(:placeholder-shown) ~ label {
  font-size: 0.9rem;
  top: 10px;
  transform: translateY(-120%);
  color: #4A90E2;
}

.pass-icon {
  position: absolute;
  top: 10px;
  right: 15px;
  width: 16px;
  cursor: pointer;
  display: none;
}

.input-field input:focus ~ .pass-icon, .input-field input:not(:placeholder-shown) ~ .pass-icon {
  display: block;
}

.forget {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 35px 0;
  color: #FFFFFF;
}
#remember {
  accent-color: #FFFFFF;
}

.forget label {
  display: flex;
  align-items: center;
}

.forget label p {
  margin-left: 8px;
  font-size: 13px;
}

.forget a{
  font-size: 13px;
}

.wrapper a {
  color: cornflowerblue;
  text-decoration: underline;
}

button {
  background: #aeb6bf;
  color: #17202a;
  font-weight: 600;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 17px;
  border: 2px solid transparent;
  transition: 0.3s ease;
}

button:hover {
  color: #fff;
  border-color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

.register {
  text-align: center;
  margin-top: 20px;
  color: #FFFFFF;
}

</style>
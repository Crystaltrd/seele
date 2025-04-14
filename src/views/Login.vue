<template>
  <div class="login-container">
    <Background/>

    <div class="wrapper">
      <form @submit.prevent="handleLogin">
        <img id="logo" src="../assets/univLogo.png" alt="LOGO"/>
        <h2>Welcome back !</h2>

        <p v-if="loginError" class="error-message">
          {{ loginError }}
        </p>

        <div class="input-field">
          <i class="fas fa-user"></i>
          <input v-model="identifier" type="text" required placeholder=" "/>
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
          <div class="remember-block">
            <input id="remember" type="checkbox" v-model="rememberMe"/>
            <label for="remember">Keep me signed in</label>
          </div>
          <a href="#" @click.prevent="showPasswordAlert">Forgot password?</a>
        </div>


        <button class="btn" type="submit" v-if="!isLoading">Log in</button>

        <div v-else class="loader-container">
          <svg viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
          </svg>
        </div>

        <div class="register">
          <p>Don't have an account?
            <router-link to="/signup">Sign Up</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import Background from "../components/background.vue";
import visibleIcon from "../assets/visible.png";
import hiddenIcon from "../assets/hidden.png";
import router from "../router";
import {isAuthenticated, sessionID, userDisplayName} from "../authStore";
import Swal from 'sweetalert2';


export default {
  name: "Login",
  components: {Background: Background},
  setup() {
    const identifier = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const rememberMe = ref(false);
    const loginError = ref("");
    const isLoading = ref(false);


    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const showPasswordAlert = () => {
      Swal.fire({
        title: 'Password Help',
        html: `
             <div style="text-align:center">
                  <i class="fas fa-unlock-alt" style="font-size:48px;color:#4A90E2;margin-bottom:15px"></i>
                  <p>Please contact the administrators at:</p>
                     <p><b>alexandriasupport@univ-bejaia.dz</b></p>
              </div>
    `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#4A90E2',
        background: '#2c2c3a',
        color: 'white'
      })
    }

    const handleLogin = async () => {
      isLoading.value = true;
      loginError.value = ''

      try {
        const queryParams = new URLSearchParams({
          UUID: identifier.value,
          passwd: password.value,
        });

        if (rememberMe.value) {
          queryParams.append("remember", "true");
        }
        console.log(queryParams.toString());
        const response = await fetch(apiurl + `auth.cgi`, {
          method: "POST",
          headers: {
            Accept: 'application/json',
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: queryParams
        });

        const rawText = await response.text();
        console.log("Response text:", rawText);

        try {
          const jsonResponse = JSON.parse(rawText);
          console.log("Parsed JSON:", jsonResponse);

          if (jsonResponse.authenticated) {
            console.log("Login successful", jsonResponse);
            isAuthenticated.value = true;
            localStorage.setItem('isAuthenticated', true);
            if (jsonResponse.sessionid) {
              sessionID.value= jsonResponse.sessionid;
              localStorage.setItem('sessionID', jsonResponse.sessionid);
              console.log(sessionID.value)
            }
            if (jsonResponse.user && jsonResponse.user.disp_name) {
              userDisplayName.value = jsonResponse.user.disp_name;
              localStorage.setItem('userDisplayName', jsonResponse.user.disp_name);
            }
            await Swal.fire({
              title: "Login successfully !",
              text: `Welcome,  ${jsonResponse.user.disp_name} !`,
              icon: "success",
              iconColor: "#4A90E2",
              draggable: true,
              background: "#2c2c3a",
              color: "#fff",
              timer: 3000,
              timerProgressBar: true
            });
            const redirectTo = router.currentRoute.value.query.redirect || '/';
            await router.push(redirectTo);
          } else {
            console.warn("Login failed:", jsonResponse.error || "Unknown error");
            loginError.value = "The Username or Password that you provided are wrong ";
          }
        } catch (parseError) {
          console.error("Failed to parse JSON:", parseError);
          loginError.value = "Unknown error, please try again";
        }
      } catch (fetchError) {
        console.error("Error in API:", fetchError);
        loginError.value = "Unknown error, please try again";
      } finally {
        isLoading.value = false;
      }
    };

    return {
      identifier,
      password,
      showPassword,
      togglePassword,
      handleLogin,
      rememberMe,
      visibleIcon,
      hiddenIcon,
      loginError,
      isLoading,
      showPasswordAlert
    };

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

.remember-block {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
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
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0 35px 0;
  color: #FFFFFF;
}

#remember {
  accent-color: #FFFFFF;
}

.remember-block label{
  font-size: 12px ;
}

.forget label {
  display: flex;
  align-items: center;
}

.forget label p {
  margin-left: 8px;
  font-size: 13px;
}

.forget a {
  font-size: 13px;
  color: cornflowerblue;
  text-decoration: underline;
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

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}

.error-message {
  color: #ff4d4d;
  background-color: rgba(255, 77, 77, 0.1);
  border: 1px solid #ff4d4d;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  margin-top: 10px;
  animation: shake 0.3s ease-in-out;
  font-weight: bold;
  font-size: 1rem;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
}

svg {
  width: 3.25em;
  transform-origin: center;
  animation: rotate4 2s linear infinite;
}

circle {
  fill: none;
  stroke: hsl(214, 97%, 59%);
  stroke-width: 2;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash4 1.5s ease-in-out infinite;
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
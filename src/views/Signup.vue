<template>
  <div class="signup-container">
    <Background/>
    <button type="button" class="go-back-btn" @click="goBack">
      <i class="fas fa-arrow-left"></i> Go Back
    </button>

    <div class="wrapper">
      <header class="header">
        <img alt="LOGO" id="logo" src="../assets/univLogo.png">
        <h1>Create an account</h1>
        <p id="txt">Please complete your informations to sign up</p>

      </header>

      <form @submit.prevent="handleSubmit">
        <div class="form-content">
          <div class="left-section">
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input v-model="displayName" id="display-name" placeholder="" type="text" required/>
              <label for="display-name">Choose your display name</label>
            </div>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input v-model="identifier" id="choose-identifier" placeholder="" type="text" required/>
              <label for="choose-identifier">Choose an identifier</label>
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input v-model="password" @blur="validate" :type="passwordVisible ? 'text' : 'password'" id="password"
                     placeholder=" " required/>
              <img alt="" class="pass-icon" @click="togglePassword" :src="passwordVisible ? visibleIcon : hiddenIcon"/>
              <label>Choose a password</label>
            </div>

            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input v-model="confirmPassword" @input="confirm" :type="confirmPasswordVisible ? 'text' : 'password'"
                     id="confirm-password" placeholder=" " required/>
              <img alt="" class="pass-icon" @click="toggleConfirmPassword"
                   :src="confirmPasswordVisible ? visibleIcon : hiddenIcon"/>
              <label>Confirm the password</label>
            </div>
            <h2>Select Your Role</h2>
            <div class="radio-inputs">
              <template v-for="rolei in roles" v-if="!loadingroles">
                <label>
                  <input v-model="role" type="radio" v-bind:value="rolei.roleName.toString()" class="radio-input"/>
                  <span class="radio-tile">
                  <span class="radio-icon"><img v-bind:alt="rolei.roleName.toString().toLowerCase()"
                                                src="../assets/professor.png"></span>
                  <span class="radio-label">{{
                      rolei.roleName.toString().charAt(0) + rolei.roleName.toString().substring(1).toLowerCase()
                    }}</span>
                </span>
                </label>
              </template>

              <svg viewBox="25 25 50 50" v-else>
                <circle r="20" cy="50" cx="50"></circle>
              </svg>

            </div>
          </div>
          <div class="right-section">
            <h2>Select Your Campus</h2>
            <div class="radio-inputs">
              <template v-for="camp in campuses" v-if="!loadingcampuses">
                <label>
                  <input v-model="campus" type="radio" v-bind:value="camp.campusName" class="radio-input"/>
                  <span class="radio-tile">
                  <span class="radio-icon"><img v-bind:alt="camp.campusName" src="../assets/campus.png"></span>
                  <span class="radio-label">{{ camp.campusName }}</span>
                </span>
                </label>
              </template>

              <svg viewBox="25 25 50 50" v-else>
                <circle r="20" cy="50" cx="50"></circle>
              </svg>
            </div>

            <div class="form-footer">
              <p v-if="passwordError || confirmError" class="error-message">
                <span v-if="passwordError">Password must be at least 8 characters. </span>
                <span v-if="confirmError">Passwords do not match.</span>
              </p>

              <p v-if="serverError" class="error-message">{{ serverError }}</p>
              <button class="btn" type="submit" v-if="!loading">Sign Up</button>

              <div v-else class="loader-container">
                <svg viewBox="25 25 50 50">
                  <circle r="20" cy="50" cx="50"></circle>
                </svg>
              </div>
              <p class="register">Already have an account?
                <router-link to="/login">Log in</router-link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import Background from "../components/background.vue";
import visibleIcon from "../assets/visible.png";
import hiddenIcon from "../assets/hidden.png";
import {isAuthenticated, userDisplayName} from "../authStore.js";
import Swal from 'sweetalert2';
import router from "../router";


export default defineComponent({
  components: {Background: Background},
  data() {
    return {
      displayName: "",
      identifier: "",
      password: "",
      confirmPassword: "",
      role: "",
      campus: "",
      passwordVisible: false,
      confirmPasswordVisible: false,
      passwordError: false,
      confirmError: false,
      loading: false,
      loadingroles: true,
      loadingcampuses: true,
      serverError: "",
      visibleIcon,
      hiddenIcon,
      campuses: "",
      roles: "",
    };
  },
  methods: {

    goBack() {
      router.push('/');
    },
    togglePassword() {
      this.passwordVisible = !this.passwordVisible;
    },
    toggleConfirmPassword() {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    },
    validate() {
      this.passwordError = this.password.length < 8;
    },
    confirm() {
      this.confirmError = this.password !== this.confirmPassword;
    },

    handleSubmit() {
      this.validate();
      this.confirm();

      if (!this.passwordError && !this.confirmError) {
        this.handleSignup();
      }
    },

    async getCampuses() {
      this.serverError = "";
      try {
        const response = await fetch(apiurl + 'query/campus', {
          method: "GET",
          headers: {
            Accept: 'application/json',
          },
          credentials: 'include'
        });

        const rawText = await response.text();
        console.log("Response text:", rawText);
        try {
          const jsonResponse = JSON.parse(rawText);
          console.log(jsonResponse.hasOwnProperty("res"));
          if (jsonResponse.hasOwnProperty("res")) {
            this.campuses = jsonResponse.res;
            this.loadingcampuses = false;
          } else {
            this.serverError = "Server error. Please try again later.";
          }
        } catch (parseError) {
          this.serverError = "Server error. Please try again later.";
        }
      } catch (error) {
        this.serverError = "Network error. Please check your connection.";
      }
    },
    async getRoles() {
      this.serverError = "";
      try {
        const response = await fetch(apiurl + 'query/role?perms=1', {
          method: "GET",
          headers: {
            Accept: 'application/json',
          },
          credentials: 'include'
        });

        const rawText = await response.text();
        console.log("Response text:", rawText);
        try {
          const jsonResponse = JSON.parse(rawText);
          console.log(jsonResponse.hasOwnProperty("res"));
          if (jsonResponse.hasOwnProperty("res")) {
            this.roles = jsonResponse.res;
            this.loadingroles = false;

          } else {
            this.serverError = "Server error. Please try again later.";
          }
        } catch (parseError) {
          this.serverError = "Server error. Please try again later.";
        }
      } catch (error) {
        this.serverError = "Network error. Please check your connection.";
      }
    },
    async handleSignup() {
      this.serverError = "";
      this.loading = true;

      try {
        const userForm = new FormData();
        userForm.append('UUID', this.identifier);
        userForm.append('name', this.displayName);
        userForm.append('passwd', this.password);
        userForm.append('role', this.role);
        userForm.append('campus', this.campus);
        console.log(userForm.toString())
        const response = await fetch(apiurl + 'signup', {
          method: "POST",
          headers: {
            Accept: 'application/json',
          },
          body: userForm,
          credentials: 'include'
        });

        const rawText = await response.text();
        console.log("Response text:", rawText);

        try {
          const jsonResponse = JSON.parse(rawText);
          if (jsonResponse.account_created) {
            isAuthenticated.value = true;
            userDisplayName.value = this.displayName;
            await Swal.fire({
              title: "Account created successfully!",
              text: `You are being redirected to the login page, ${this.displayName}!`,
              icon: "success",
              iconColor: "#4A90E2",
              draggable: true,
              background: "#2c2c3a",
              color: "#fff",
              timer: 3000,
              timerProgressBar: true
            });
            const redirectTo = this.$route.query.redirect || '/login';
            this.$router.push(redirectTo);
          } else {
            this.serverError = jsonResponse.error || "Registration failed. Please check your information.";
          }
        } catch (parseError) {
          this.serverError = "Server error. Please try again later.";
        }
      } catch (error) {
        this.serverError = "Network error. Please check your connection.";
      } finally {
        this.loading = false;
      }
    }
  },
  beforeMount() {
    this.getCampuses()
    this.getRoles()
  }
});

</script>

<style scoped>
* {
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.signup-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 20px 0;
}

.wrapper {
  position: relative;
  z-index: 1;
  width: 1020px;
  max-width: 95%;
  border-radius: 8px;
  padding: 30px;
  margin: 20px auto;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
}
.go-back-btn {
  position: absolute;
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

.go-back-btn i {
  font-size: 0.8rem;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

#logo {
  width: 130px;
  height: auto;
  margin-bottom: 5px;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 5px;
  font-weight: 700;
  color: white;
}

#txt {
  color: #d5dbdb;
  font-size: 0.75rem;
}

.form-content {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.left-section, .right-section {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  text-align: center;
}

.input-field {
  position: relative;
  display: flex;
  flex-wrap: wrap;
}

.input-field i {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #4A90E2;
}

.input-field input {
  width: 100%;
  height: 30px;
  padding-left: 40px;
  background: transparent;
  border: none;
  border-bottom: 2px solid #4A90E2;
  outline: none;
  font-size: 13px;
  color: #FFFFFF;
}

.input-field input:focus ~ label,
.input-field input:not(:placeholder-shown) ~ label {
  font-size: 0.8rem;
  top: 10px;
  transform: translateY(-120%);
  color: #4A90E2;
}

.input-field label {
  position: absolute;
  top: 50%;
  left: 40px;
  transform: translateY(-50%);
  color: #FFFFFF;
  pointer-events: none;
  transition: 0.15s ease;
  font-size: 16px;
}

.input-field input:not(:focus):not(:placeholder-shown) ~ label {
  font-size: 0.8rem;
  top: 10px;
  transform: translateY(-120%);
  color: #4A90E2;
}

.pass-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 16px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.input-field input:focus ~ .pass-icon,
.input-field input:not(:placeholder-shown) ~ .pass-icon {
  opacity: 1;
}

.input-field input::placeholder {
  color: rgba(255, 255, 255, 0.5);
  opacity: 1;
  transition: opacity 0.3s ease;
}

.input-field input:focus::placeholder {
  opacity: 1;
}

h2 {
  font-size: 0.9rem;
  margin-bottom: 4px;
  color: white;
}

.radio-inputs {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.radio-input {
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.radio-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  min-height: 80px;
  border-radius: 0.5rem;
  border: 2px solid #4a5265;
  background-color: rgba(5, 3, 32, 0.8);
  transition: 0.15s ease;
  cursor: pointer;
}

.radio-tile:before {
  display: none;
}

.radio-tile:hover {
  border-color: #4d8bff;
}

.radio-input:checked + .radio-tile {
  border-color: #4d8bff;
  box-shadow: 0 5px 10px rgba(255, 255, 255, 0.1);
}

.radio-label {
  color: #FFFFFF;
  font-size: 0.9rem;
  margin-top: 10px;
  transition: 0.3s ease;
}

.radio-tile:hover .radio-label {
  color: #4d8bff;
}

.radio-input:checked + .radio-tile .radio-label {
  color: #4d8bff;
}

.radio-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.radio-icon img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.btn {
  background: #aeb6bf;
  color: #17202a;
  font-weight: 600;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 16px;
  border: 2px solid transparent;
  transition: 0.3s ease;
}

.btn:hover {
  color: #fff;
  border-color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

.form-footer {
  text-align: center;
  margin-top: 20px;
}

.error-message {
  background-color: rgba(255, 0, 0, 0.1);
  color: #ff4d4f;
  padding: 10px;
  font-weight: bold;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 10px;
  text-align: center;
  animation: shake 0.3s ease-in-out;
  border: 1px solid #ff4d4f;
}

.register {
  margin-top: 20px;
  color: #d5dbdb;
}

.register a {
  color: #4A90E2;
  text-decoration: underline;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  50% {
    transform: translateX(4px);
  }
  75% {
    transform: translateX(-4px);
  }
  100% {
    transform: translateX(0);
  }
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
}

.loader-container svg {
  width: 3.25em;
  transform-origin: center;
  animation: rotate4 2s linear infinite;
}

.loader-container circle {
  fill: none;
  stroke: hsl(214, 97%, 59%);
  stroke-width: 2;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash4 1.5s ease-in-out infinite;
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

@media (max-width: 768px) {
  .wrapper {
    padding: 25px;
    margin: 20px auto;
    max-height: none;
    overflow-y: auto;
  }

  .left-section, .right-section {
    gap: 20px;
  }

  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1rem;
  }

  .btn {
    width: 100%;
    padding: 10px;
  }
}

@media (max-width: 992px) {
  .wrapper {
    padding: 25px;
  }

  .form-content {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .wrapper {
    padding: 20px;
    margin: 40px auto;
  }

  .form-content {
    flex-direction: column;
    gap: 25px;
  }

  h1 {
    font-size: 1.7rem;
  }

  .radio-inputs {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .wrapper {
    padding: 20px;
    margin: 15px auto;
  }

  h1 {
    font-size: 1.5rem;
  }

  #logo {
    width: 100px;
  }

  .input-field input {
    height: 45px;
    font-size: 0.9rem;
  }

  .radio-tile {
    width: 85px;
    min-height: 85px;
  }

  .btn {
    padding: 12px;
  }

  .form-footer {
    margin-top: 30px;
  }
}

@media (max-width: 400px) {
  .go-back-btn {
    top: 10px;
    left: 10px;
    font-size: 0.8rem;
    padding: 6px 10px;
  }

  .radio-tile {
    width: 75px;
    min-height: 75px;
  }

  .radio-label {
    font-size: 0.8rem;
  }
}
</style>

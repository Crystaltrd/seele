<template>
  <div class="help-container">
    <Background />
    <div class="wrapper">
      <div class="section-header">
        <h2>Looking for help?</h2>
        <p class="subtitle">These are the most commonly asked questions about Alexandria website.
          <br>Can't find what you're looking for? Say hi at <a href="mailto:webmaster.bejaia@univ-bejaia.dz">webmaster.bejaia@univ-bejaia.dz</a>
        </p>
      </div>

      <div class="faq-section">
        <div class="faq-category">
          <h3>Account creation and management</h3>
          <div class="faq-item" :class="{ active: activeItem === 0 }">
            <button class="faq-question" @click="toggleFAQ(0)">
              Who can register?
              <span class="toggle-icon">{{ activeItem === 0 ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>All students and professors can create an account. You do not need an email address. You only need to choose a display name, identifier and a password</p>
            </div>
          </div>
          <div class="faq-item" :class="{ active: activeItem === 1 }">
            <button class="faq-question" @click="toggleFAQ(1)">
              How to Signup / register ?
              <span class="toggle-icon">{{ activeItem === 1 ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <ol>
                <li>Click on "Signup" in the main menu</li>
                <li>Complete the formular with your informations </li>
                <p>or</p>
                <li>Click on "Login" in the main menu</li>
                <li>Select "Sign up"</li>
                <li>Complete the formular with your informations</li>
              </ol>
            </div>
          </div>
          <div class="faq-item" :class="{ active: activeItem === 2 }">
            <button class="faq-question" @click="toggleFAQ(2)">
              Forgot your password?
              <span class="toggle-icon">{{ activeItem === 2 ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>(actually , we Don't have an option to help you to recover your password , so please contact us at <a href="mailto:webmaster.bejaia@univ-bejaia.dz">webmaster.bejaia@univ-bejaia.dz</a>)</p>
            </div>
          </div>
          <div class="faq-item" :class="{ active: activeItem === 3 }">
            <button class="faq-question" @click="toggleFAQ(3)">
              Can I access my profile?
              <span class="toggle-icon">{{ activeItem === 3 ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>(no)</p>
            </div>
          </div>
          <div class="faq-item" :class="{ active: activeItem === 4 }">
            <button class="faq-question" @click="toggleFAQ(4)">
              Can I delete my account?
              <span class="toggle-icon">{{ activeItem === 4 ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>(no)</p>
            </div>
          </div>
        </div>

        <div class="faq-category">
          <h3>Borrowing and Reading</h3>
          <p class="category-description">First you have to search for the publication you want to borrow (if you don't already see it on the home page)</p>
          <div class="faq-item" :class="{ active: activeItem === 5 }">
            <button class="faq-question" @click="toggleFAQ(5)">
              Simple search
              <span class="toggle-icon">{{ activeItem === 5 ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>The simple search bar is located in the main menu at the top of each page. It allows you to perform quick searches using keywords such as :
              </p>
              <ul>
                <li>Book title</li>
                <li>Author name</li>
                <li>Subject</li>
              </ul>
            </div>
          </div>
          <div class="faq-item" :class="{ active: activeItem === 6 }">
            <button class="faq-question" @click="toggleFAQ(6)">
              Advanced search
              <span class="toggle-icon">{{ activeItem === 6 ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>For more precise results, click on "Advanced search".A new page will open where you can enter multiple fields. You can fill in :
              </p>
              <ul>
                <li>Publication title (required)</li>
                <li>Author name</li>
                <li>Subject</li>
                <li>Editor</li>
                <li>Publication year</li>
                <li>Editor</li>
                <li>Document type</li>
                <li>Language</li>
              </ul>
            </div>
          </div>
          <div class="faq-item" :class="{ active: activeItem === 7 }">
            <button class="faq-question" @click="toggleFAQ(7)">
              How to borrow a publication?
              <span class="toggle-icon">{{ activeItem === 7 ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <ol>
                <li> Log in to your account</li>
                <li>Search for the publication you want to borrow</li>
                <li>Click on the publication's cover to select it</li>
                <li>Choose the duration</li>
                <li>Click "borrow". The publication will be Added to your personal space</li>
              </ol>
            </div>
          </div>
          <div class="faq-item" :class="{ active: activeItem === 8 }">
            <button class="faq-question" @click="toggleFAQ(8)">
              How many publications can I borrow at the same time?
              <span class="toggle-icon">{{ activeItem === 8 ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>you can borrow up to 3 publications simultaneously</p>
            </div>
          </div>
          <div class="faq-item" :class="{ active: activeItem === 9 }">
            <button class="faq-question" @click="toggleFAQ(9)">
              Can I download the books I borrow?
              <span class="toggle-icon">{{ activeItem === 9 ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>(no)</p>
            </div>
          </div>
          <div class="faq-item" :class="{ active: activeItem === 10 }">
            <button class="faq-question" @click="toggleFAQ(10)">
              I'm having a technical issue. What should I do?
              <span class="toggle-icon">{{ activeItem === 10 ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>First, check this Help page. If the issue persists, please contact our team through the "About" section </p>
            </div>
          </div>
        </div>

        <div class="faq-category">
          <h3>Technical Requirements</h3>
          <div class="faq-item" :class="{ active: activeItem === 11 }">
            <button class="faq-question" @click="toggleFAQ(11)">
              What browsers are supported?
              <span class="toggle-icon">{{ activeItem === 11 ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>Alexandria works best on the latest versions of Chrome, Firefox, Safari, and Edge. JavaScript must be enabled.</p>
            </div>
          </div>
          <div class="faq-item" :class="{ active: activeItem === 12 }">
            <button class="faq-question" @click="toggleFAQ(12)">
              Do I need any special software?
              <span class="toggle-icon">{{ activeItem === 12 ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>(no)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.help-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 3rem 1.5rem;
  background-color: transparent;
}

.wrapper {
  position: relative;
  z-index: 1;
  margin: 6rem auto;
  padding: 2.5rem 3rem;
  width: 1020px;
  border-radius: 16px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
}

.section-header {
  text-align: center;
  position: relative;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2rem;
  -webkit-background-clip: text;
  background-clip: text;
  color: white;
  display: inline-block;
  position: relative;
  margin-bottom: 0.3rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.6;
}

.subtitle a {
  color: #4A90E2;
  text-decoration: none;
  transition: color 0.3s ease;
}

.subtitle a:hover {
  color: #3a7bc8;
  text-decoration: underline;
}

.faq-section {
  margin-top: 2rem;
}

.faq-category {
  margin-bottom: 2.5rem;
}

.faq-category h3 {
  color: white;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.category-description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
}

.faq-item {
  margin-bottom: 0.8rem;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.faq-question {
  width: 100%;
  padding: 1rem 1.5rem;
  text-align: left;
  color: white;
  background: transparent;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.faq-question:hover {
  background: rgba(255, 255, 255, 0.1);
}

.toggle-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: 0 1.5rem;
  background: rgba(255, 255, 255, 0.03);
}

.faq-answer p, .faq-answer ol, .faq-answer ul {
  color: rgba(255, 255, 255, 0.8);
  padding: 1rem 0;
  line-height: 1.6;
  margin: 0;
}

.faq-item.active .faq-answer {
  max-height: 500px;
  padding: 0 1.5rem;
}

.faq-item.active {
  background: rgba(255, 255, 255, 0.08);
}

@media (max-width: 768px) {
  .wrapper {
    padding: 1.5rem;
    margin: 4rem auto;
    width: 95%;
  }

  .section-header h2::after {
    width: 80%;
  }

  .faq-question {
    padding: 0.8rem 1rem;
    font-size: 0.95rem;
  }

  .faq-answer p, .faq-answer ol, .faq-answer ul {
    font-size: 0.9rem;
  }
}
</style>

<script setup lang="ts">
import Background from "../components/background.vue";
import { ref } from 'vue';

const activeItem = ref<number | null>(null);

const toggleFAQ = (index: number) => {
  activeItem.value = activeItem.value === index ? null : index;
};
</script>
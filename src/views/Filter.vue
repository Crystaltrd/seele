<template>
  <div class="filter-container">
    <Background />
    <div class="wrapper">
      <header>
        <h1>Advanced Search</h1>
        <p class="subtitle">Find exactly what you're looking for in our extensive collection</p>
      </header>

      <form>
        <div class="form-grid">
          <div class="input-field">
            <label for="title">* Title</label>
            <input id="title" placeholder="Enter the title..." type="text" class="input" required>
          </div>

          <div class="input-field">
            <label for="author">Author</label>
            <input id="author" placeholder="Enter the author's name..." type="text" class="input">
          </div>

          <div class="input-field">
            <label for="subject">Subject</label>
            <input id="subject" placeholder="Enter the subject..." type="text" class="input">
          </div>

          <div class="input-field">
            <label for="editor">Editor</label>
            <input id="editor" placeholder="Enter editor..." type="text" class="input">
          </div>

          <div class="input-field">
            <label for="year">Publication Year</label>
            <select id="year" class="select">
              <option value="">Any year</option>
            </select>
          </div>

          <div class="input-field">
            <label for="doc-type">Document Type</label>
            <select id="doc-type" class="select">
              <option value="">Any type</option>
            </select>
          </div>

          <div class="input-field">
            <label for="language">Language</label>
            <select id="language" class="select">
              <option value="">Any language</option>
            </select>
          </div>

          <div class="input-field"></div>
        </div>

        <button class="btn" type="submit">
          <span>Search</span>
          <i class="fa-solid fa-magnifying-glass" style="color: #ffffff;"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.wrapper {
  position: relative;
  margin-top: 6rem;
  z-index: 1;
  width: 1020px;
  border-radius: 16px;
  padding: 2.5rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

header {
  text-align: center;
  margin-bottom: 2.5rem;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
}

.input, .select {
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.input:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.input:focus, .select:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #4A90E2;
  color: white;
  font-weight: 600;
  padding: 0.8rem 2rem;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  border: none;
  transition: all 0.3s ease;
  margin-left: 55rem;
}

.btn:hover {
  background: #3a7bc8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .wrapper {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
import Background from "../components/background.vue";

</script>
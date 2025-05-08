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
            <label for="title">Title</label>
            <input id="title" placeholder="Enter the title..." type="text" class="input">
          </div>

          <div class="input-field">
            <label for="isbn">ISBN,ISSN..</label>
            <input id="isbn" placeholder="Enter the ISBN,ISSN..." type="text" class="input">
          </div>

          <div class="input-field">
            <label for="author">Author</label>
            <input id="author" placeholder="Enter the author's name..." type="text" class="input">
          </div>

          <div class="input-field">
            <label for="subject">Category</label>
            <select id="category" class="select" v-if="!loadingCategories">
              <option value="">Any category</option>
              <option
                  v-for="category in categories"
                  :key="category.categoryClass"
                  :value="category.categoryClass"
              >
                {{ category.categoryName }}
              </option>
            </select>
            <div v-else class="loading">Loading categories...</div>
          </div>

          <div class="input-field">
            <label for="editor">Publisher</label>
            <input id="editor" placeholder="Enter editor..." type="text" class="input">
          </div>

          <div class="input-field">
            <label>Type of year selection</label>
            <div>
              <label>
                <input  v-model="yearSelectionType" name="year_selection_type" type="radio" value="single" @change="toggleYearSelection()"/>
                <span>Single year</span>
              </label>
              <label>
                <input  v-model="yearSelectionType" name="year_selection_type" type="radio" value="range" @change="toggleYearSelection()"/>
                <span>interval</span>
              </label>
            </div>
          </div>


          <div class="input-field">
            <label for="doc-type">Document Type</label>
            <select id="doc-type" class="select" v-if="!loadingDocTypes">
              <option value="">Any type</option>
              <option
                  v-for="docType in docTypes"
                  :key="docType"
                  :value="docType"
              >
                {{ docType }}
              </option>
            </select>
            <div v-else class="loading">Loading document types...</div>
          </div>

          <div id="single-year-container" class="input-field">
            <label for="year">Publication year</label>
            <select id="year" class="select">
              <option value="">Any year</option>
              <option
                  v-for="year in years"
                  :key="year"
                  :value="year"
              >
                {{ year }}
              </option>
            </select>
          </div>

          <div id="year-range-container" class="input-field" style="display: none;">
            <label for="start-year">From</label>
            <select id="start-year" class="select">
              <option value="">Any year</option>
              <option
                  v-for="year in years"
                  :key="'start-'+year"
                  :value="year"
              >
                {{ year }}
              </option>
            </select>

            <label for="end-year">To</label>
            <select id="end-year" class="select">
              <option value="">Any year</option>
              <option
                  v-for="year in years"
                  :key="'end-'+year"
                  :value="year"
              >
                {{ year }}
              </option>
            </select>
          </div>

          <div class="input-field">
            <label for="language">Language</label>
            <select id="language" class="select" v-if="!loadingLanguages">
              <option value="">Any language</option>
              <option
                  v-for="language in languages"
                  :key="language"
                  :value="language"
              >
                {{ language.toUpperCase() }}
              </option>
            </select>
            <div v-else class="loading">Loading languages...</div>
          </div>

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
  padding: 2rem 1rem;
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
  display: block;
  align-items: center;
  justify-content: center;
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
  margin-left: 55rem;
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


#year-range-container {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
}

#year-range-container .input-field {
  flex: 1;
  min-width: 0;
}

.select {
  width: 100%;
  min-width: 150px;
}

.input-field label {
  margin-bottom: 0.8rem;
}


.input-field > div {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.8rem;
}

.input-field > div label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.loading {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  padding: 0.5rem 0;
}

.error-message {
  color: #ff6b6b;
  padding: 0.5rem 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .wrapper {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1200px) {
  .wrapper {
    width: 900px;
  }
}

@media (max-width: 992px) {
  .wrapper {
    width: 750px;
    padding: 2rem;
  }

  .btn {
    margin-left: auto;
  }
}

@media (max-width: 768px) {
  .wrapper {
    width: 90%;
    padding: 1.5rem;
    margin: 3rem auto;
  }

  h1 {
    font-size: 1.8rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .btn {
    width: 100%;
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .wrapper {
    padding: 1.5rem 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }

  .input, .select {
    padding: 0.7rem 0.9rem;
    font-size: 0.9rem;
  }

  .btn {
    padding: 0.7rem 1.5rem;
  }
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import Background from "../components/background.vue";

const yearSelectionType = ref('single');
const categories = ref([]);
const languages = ref([]);
const docTypes = ref([]);
const loadingCategories = ref(false);
const loadingLanguages = ref(false);
const loadingDocTypes = ref(false);
const serverError = ref("");


const currentYear = new Date().getFullYear();
const years = Array.from({length: currentYear - 1500 + 1}, (_, i) => currentYear - i);


function toggleYearSelection() {
  const singleYearContainer = document.getElementById('single-year-container');
  const rangeContainer = document.getElementById('year-range-container');

  if (yearSelectionType.value === 'single') {
    singleYearContainer.style.display = 'block';
    rangeContainer.style.display = 'none';
  } else {
    singleYearContainer.style.display = 'none';
    rangeContainer.style.display = 'block';
  }
}

async function getCategories() {
  serverError.value = "";
  loadingCategories.value = true;
  try {
    const response = await fetch(`${apiurl}query/category`, {
      method: "GET",
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    });

    const data = await response.json();
    if (data.res) {
      categories.value = data.res.sort((a, b) =>
          a.categoryClass.localeCompare(b.categoryClass)
      );
    }
  } catch (error) {
    serverError.value = "Failed to load categories";
  } finally {
    loadingCategories.value = false;
  }
}

async function getLanguages() {
  serverError.value = "";
  loadingLanguages.value = true;
  try {
    const response = await fetch(`${apiurl}query/lang`, {
      method: "GET",
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    });

    const data = await response.json();
    if (data.res) {
      languages.value = data.res.map(lang => lang.langcode);
    }
  } catch (error) {
    serverError.value = "Failed to load languages";
  } finally {
    loadingLanguages.value = false;
  }
}

async function getDocTypes() {
  serverError.value = "";
  loadingDocTypes.value = true;
  try {
    const response = await fetch(`${apiurl}query/doctype`, {
      method: "GET",
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    });

    const data = await response.json();
    if (data.res) {
      docTypes.value = data.res.map(type => type.typeName);
    }
  } catch (error) {
    serverError.value = "Failed to load document types";
  } finally {
    loadingDocTypes.value = false;
  }
}

onMounted(async () => {
  await Promise.all([
    getCategories(),
    getLanguages(),
    getDocTypes()
  ]);
  toggleYearSelection();
});
</script>
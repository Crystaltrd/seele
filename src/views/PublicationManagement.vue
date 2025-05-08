<template>
  <div class="publication-container">
    <Background/>
    <AdminsHeader/>

    <section id="publication">
      <div class="container">
        <div class="content-wrapper">
          <h3 class="section-heading">Publications list</h3>
          <div class="account-grid">
            <div class="filter-actions-wrapper">
              <div class="btn-wrapper">
                <button class="btn" type="submit" @click="showAddModal = true">
                  <i class="fa-solid fa-plus" style="color: #ffffff;"></i>
                  <span>add</span>
                </button>

                <button class="btn" type="submit">
                  <i class="fa-solid fa-minus" style="color: #ffffff;"></i>
                  <span>delete</span>
                </button>

                <button class="btn" type="submit">
                  <i class="fa-solid fa-pen" style="color: #ffffff;"></i>
                  <span>Edit</span>
                </button>
              </div>

              <div class="filter-wrapper">
                <div class="input-field">
                  <select id="filter" class="select">
                    <option value="">Filter</option>
                  </select>
                </div>
              </div>
            </div>


            <div v-if="isLoading" class="loading">
              <svg viewBox="25 25 50 50" class="spinner">
                <circle r="20" cy="50" cx="50"></circle>
              </svg>
            </div>

            <div v-else-if="books.length === 0" class="empty">
              No books found
            </div>

            <div class="books-list">
              <div class="book-item" v-for="book in books" :key="book.serialnum">
                <div class="book-info">
                  <h4>{{ book.booktitle }}</h4>
                  <div class="meta">
                    <span>{{ book.authors.join(', ') }}</span>
                    <span>{{ book.publisher }} ({{ book.bookreleaseyear }})</span>
                  </div>
                  <div class="stock-info">
                     <span v-for="stock in book.stock" :key="stock.campus">
                       {{ stock.campus }}: {{ stock.stock }}
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="showAddModal" class="modal-overlay">
            <div class="modal-wrapper">
              <div class="modal-header">
                <h3>Add a publication to the stock</h3>
                <p class="subtitle">Fill all required fields to add a new publication</p>
                <button class="modal-close" @click="showAddModal = false">
                  <i class="fa-solid fa-times"></i>
                </button>
              </div>

              <div class="modal-body">
                <form @submit.prevent="handleSubmit">
                  <div class="form-grid">
                    <div class="form-column">
                      <div class="input-field">
                        <label for="serialnum">Serial Number</label>
                        <input id="serialnum" v-model="newPublication.serialnum" type="text" class="input" required>
                      </div>

                      <div class="input-field">
                        <label for="booktitle">Title</label>
                        <input id="booktitle" v-model="newPublication.booktitle" type="text" class="input" required>
                      </div>

                      <div class="input-field">
                        <label for="authors">Author(s) " separate them with a comma "</label>
                        <input id="authors" v-model="newPublication.authorsInput" type="text" class="input" required>
                      </div>

                      <div class="input-field">
                        <label for="publisher">Publisher</label>
                        <input id="publisher" v-model="newPublication.publisher" type="text" class="input" required>
                      </div>

                      <div class="input-field">
                        <label for="bookreleaseyear">Release Year</label>
                        <input id="bookreleaseyear" v-model="newPublication.bookreleaseyear" type="number" class="input" min="1500" required>
                      </div>
                    </div>


                    <div class="form-column">
                      <div class="input-field">
                        <label for="type">Type</label>
                        <div v-if="loadingDocTypes" class="loading-small">
                          <svg viewBox="25 25 50 50" class="spinner-small">
                            <circle r="20" cy="50" cx="50"></circle>
                          </svg>
                          <span>Loading document types...</span>
                        </div>
                        <div v-else-if="serverError" class="error-message">
                          {{ serverError }}
                        </div>
                        <select
                            v-else
                            id="type"
                            v-model="newPublication.type"
                            class="select"
                            required
                        >
                          <option value="">Select a type</option>
                          <option
                              v-for="docType in docTypes"
                              :key="docType"
                              :value="docType"
                          >
                            {{ docType }}
                          </option>
                        </select>
                      </div>

                      <div class="input-field">
                        <label for="category">Category</label>
                        <div v-if="loadingCategories" class="loading-small">
                          <svg viewBox="25 25 50 50" class="spinner-small">
                            <circle r="20" cy="50" cx="50"></circle>
                          </svg>
                          <span>Loading categories...</span>
                        </div>
                        <div v-else-if="serverError" class="error-message">
                          {{ serverError }}
                        </div>
                        <select
                            v-else
                            id="category"
                            v-model="newPublication.category"
                            class="select"
                            required
                        >
                          <option value="">Select a category</option>
                          <option
                              v-for="cat in categories"
                              :key="cat.categoryClass"
                              :value="cat.categoryClass"
                          >
                            {{ cat.categoryName }}
                          </option>
                        </select>
                      </div>

                      <div class="input-field">
                        <label for="langs">Languages</label>
                        <div v-if="loadingLanguages" class="loading-small">
                          <svg viewBox="25 25 50 50" class="spinner-small">
                            <circle r="20" cy="50" cx="50"></circle>
                          </svg>
                          <span>Loading languages...</span>
                        </div>
                        <div v-else-if="serverError" class="error-message">
                          {{ serverError }}
                        </div>
                        <select
                            v-else
                            id="langs"
                            v-model="newPublication.langs"
                            class="select"
                            multiple
                        >
                          <option
                              v-for="lang in languages"
                              :key="lang"
                              :value="lang"
                          >
                            {{ lang.toUpperCase() }}
                          </option>
                        </select>
                      </div>

                      <div class="input-field">
                        <label for="bookcover">Cover Image</label>
                        <div class="image-upload-container">
                          <input
                              id="bookcover"
                              type="file"
                              accept="image/*"
                              @change="handleImageUpload"
                              class="image-upload-input"
                          >
                          <label for="bookcover" class="image-upload-label">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                            <span v-if="!newPublication.bookcover">Choose an image</span>
                            <span v-else>Change image</span>
                          </label>
                          <div v-if="newPublication.bookcover" class="image-preview">
                            <img :src="newPublication.bookcover" alt="Cover preview">
                            <button type="button" @click="removeImage" class="remove-image-btn">
                              <i class="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div class="input-field">
                        <label for="description">Description</label>
                        <textarea id="description" v-model="newPublication.description" class="input textarea"></textarea>
                      </div>
                    </div>
                  </div>

                  <div class="stock-section">
                    <h4>Stock by Campus</h4>
                    <div v-if="loadingCampuses" class="loading-small">
                      <svg viewBox="25 25 50 50" class="spinner-small">
                        <circle r="20" cy="50" cx="50"></circle>
                      </svg>
                      <span>Loading campuses...</span>
                    </div>

                    <div v-else-if="serverError" class="error-message">
                      {{ serverError }}
                    </div>
                    <div class="stock-grid">
                      <div class="stock-item" v-for="(campus, index) in campuses" :key="index">
                        <label :for="'stock-'+campus">{{ campus }}</label>
                        <input :id="'stock-'+campus" v-model="newPublication.stock[index].stock" type="number" min="0" class="input">
                      </div>
                    </div>
                  </div>

                  <div class="modal-actions">
                    <button type="button" class="btn btn-cancel" @click="showAddModal = false">
                      <span>Cancel</span>
                    </button>
                    <button type="submit" class="btn btn-submit">
                      <span>Add Publication</span>
                      <i class="fa-solid fa-plus" style="color: #ffffff;"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Background from "../components/background.vue"
import AdminsHeader from "../components/AdminsHeader.vue"

const books = ref([])
const isLoading = ref(true)
const showAddModal = ref(false)
const campuses = ref([])
const loadingCampuses = ref(false)
const serverError = ref("")
const categories = ref([])
const loadingCategories = ref(false)
const languages = ref([])
const loadingLanguages = ref(false)
const docTypes = ref([])
const loadingDocTypes = ref(false)

async function getLanguages() {
  serverError.value = ""
  loadingLanguages.value = true
  try {
    const response = await fetch(apiurl + 'query/lang', {
      method: "GET",
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    })

    const rawText = await response.text()
    try {
      const jsonResponse = JSON.parse(rawText)
      if (jsonResponse.hasOwnProperty("res")) {
        languages.value = jsonResponse.res.map(lang => lang.langcode)
      } else {
        serverError.value = "Server error. Please try again later."
      }
    } catch (parseError) {
      serverError.value = "Server error. Please try again later."
    }
  } catch (error) {
    serverError.value = "Network error. Please check your connection."
  } finally {
    loadingLanguages.value = false
  }
}

async function getDocTypes() {
  serverError.value = ""
  loadingDocTypes.value = true
  try {
    const response = await fetch(apiurl + 'query/doctype', {
      method: "GET",
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    })

    const rawText = await response.text()
    try {
      const jsonResponse = JSON.parse(rawText)
      if (jsonResponse.hasOwnProperty("res")) {
        docTypes.value = jsonResponse.res.map(type => type.typeName)
      } else {
        serverError.value = "Server error. Please try again later."
      }
    } catch (parseError) {
      serverError.value = "Server error. Please try again later."
    }
  } catch (error) {
    serverError.value = "Network error. Please check your connection."
  } finally {
    loadingDocTypes.value = false
  }
}

async function getCategories() {
  serverError.value = ""
  loadingCategories.value = true
  try {
    const response = await fetch(apiurl + 'query/category', {
      method: "GET",
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    })

    const rawText = await response.text()
    try {
      const jsonResponse = JSON.parse(rawText)
      if (jsonResponse.hasOwnProperty("res")) {
        categories.value = jsonResponse.res.sort((a, b) =>
            a.categoryClass.localeCompare(b.categoryClass)
        )
      } else {
        serverError.value = "Server error. Please try again later."
      }
    } catch (parseError) {
      serverError.value = "Server error. Please try again later."
    }
  } catch (error) {
    serverError.value = "Network error. Please check your connection."
  } finally {
    loadingCategories.value = false
  }
}

async function getCampuses() {
  serverError.value = ""
  loadingCampuses.value = true
  try {
    const response = await fetch(apiurl + 'query/campus', {
      method: "GET",
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    })

    const rawText = await response.text()
    try {
      const jsonResponse = JSON.parse(rawText)
      if (jsonResponse.hasOwnProperty("res")) {
        campuses.value = jsonResponse.res.map(c => c.campusName)
        newPublication.value.stock = campuses.value.map(campus => ({
          campus,
          stock: 0
        }))
      } else {
        serverError.value = "Server error. Please try again later."
      }
    } catch (parseError) {
      serverError.value = "Server error. Please try again later."
    }
  } catch (error) {
    serverError.value = "Network error. Please check your connection."
  } finally {
    loadingCampuses.value = false
  }
}

const newPublication = ref({
  serialnum: '',
  "BOOK.serialnum": '',
  type: '',
  category: '',
  categoryName: '',
  publisher: '',
  booktitle: '',
  bookreleaseyear: '',
  bookcover: '',
  description: '',
  hits: 0,
  authorsInput: '',
  authors: [],
  langs: [],
  stock: [],
})

function handleSubmit() {
  if (campuses.value.length === 0) {
    newPublication.value.stock = [{ campus: 'Default', stock: 0 }]
  }

  newPublication.value.authors = newPublication.value.authorsInput
      .split(',')
      .map(author => author.trim())
      .filter(author => author !== '')


  newPublication.value["BOOK.serialnum"] = newPublication.value.serialnum

  console.log('New publication:', newPublication.value)
  showAddModal.value = false

}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      newPublication.value.bookcover = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function removeImage() {
  newPublication.value.bookcover = '';
  const input = document.querySelector('.image-upload-input');
  if (input) input.value = '';
}

async function fetchBooks() {
  try {
    const response = await fetch(`${apiurl}query/book`, {
      method: "GET",
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    })

    const data = await response.json()
    if (data.res) {
      books.value = data.res
    }
  } catch (error) {
    console.error("Error fetching books:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchBooks()
  getCampuses()
  getCategories()
  getLanguages()
  getDocTypes()
})
</script>

<style scoped>
.publication-container {
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
  padding: 0 1.5rem;
  width: 1100px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
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

#publication{
  padding: 8rem 0;
  display: flex;
  align-items: center;
}

.account-grid {
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  scrollbar-width: none;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
}

.account-grid::-webkit-scrollbar {
  display: none;
}

.select {
  width: 100%;
  min-width: 150px;
}


.select {
  width: 100%;
  min-width: 150px;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white !important;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

.select:hover, .select:focus {
  border-color: rgba(255, 255, 255, 0.5);
  outline: none;
}

.select:focus {
  border-color: #4A90E2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}


.select option {
  background-color: #2c2c3a;
  color: white !important;
  padding: 0.5rem;
}

select[multiple] {
  height: auto;
  min-height: 100px;
  padding: 0.5rem;
  background-image: none;
}

select[multiple] option {
  padding: 0.5rem;
  margin: 0.2rem 0;
  border-radius: 4px;
}

select[multiple] option:checked {
  background: #4A90E2 !important;
  color: white !important;
}

.select option[value=""] {
  color: rgba(255, 255, 255, 0.5) !important;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.image-upload-container {
  position: relative;
  margin-top: 0.5rem;
}

.image-upload-input {
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
}

.image-upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
}

.image-upload-label:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.image-upload-label i {
  font-size: 1.2rem;
}

.image-preview {
  position: relative;
  margin-top: 1rem;
  max-width: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-image-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.loading-small {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  padding: 1rem 0;
}

.spinner-small {
  width: 20px;
  height: 20px;
}

.spinner-small circle {
  fill: none;
  stroke: #4A90E2;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite, rotate 2s linear infinite;
  transform-origin: center;
}

.error-message {
  color: #ff6b6b;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  margin: 1rem 0;
}

label{
  color : white ;
}
.select {
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.select:focus {
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
  width: 100%;
  min-width: 150px;
}

select[multiple] option:checked {
  background: #4A90E2;
  color: white;
}

select[multiple] option {
  padding: 0.5rem;
  margin: 0.2rem 0;
  background: rgba(44, 44, 58, 0.8) !important;
  color: white ;
}

.filter-actions-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 2rem;
  margin-bottom: 2rem;
}

.filter-wrapper {
  justify-content: center;
}

.btn {
  display: flex;
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
}

.btn-wrapper {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 0;
}

.btn i{
  margin-right: 5px;
}

.btn:hover {
  background: #3a7bc8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.btn:active {
  transform: translateY(0);
}

.books-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.book-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.book-item:hover {
  background: rgba(74, 144, 226, 0.1);
  transform: translateX(5px);
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  margin-bottom: 0;
}

.book-info h4 {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 1.1rem;
}

.meta {
  display: flex;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stock-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stock-info span {
  background: rgba(74, 144, 226, 0.2);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #4A90E2;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
}

.spinner {
  width: 50px;
  height: 50px;
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

.empty {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  padding: 2rem;
  width: 100%;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
}

.modal-wrapper {
  position: relative;
  z-index: 1;
  margin: 0 auto 6rem;
  padding: 2.5rem 3rem;
  width: 1100px;
  max-width: 95%;
  border-radius: 16px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  background: rgba(44, 44, 58, 0.9);
}

.modal-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 0;
  border-bottom: none;
}

.modal-header h3 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
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

.modal-body {
  padding: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.textarea {
  min-height: 100px;
  resize: vertical;
}

.stock-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stock-section h4 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.stock-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.stock-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-submit {
  background: #4A90E2;
}

.btn-submit:hover {
  background: #3a7bc8;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-field label {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
}

.input, .select, .textarea {
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.textarea {
  min-height: 100px;
  resize: vertical;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.input:hover, .select:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.input:focus, .select:focus, .textarea:focus {
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

select[multiple] {
  height: auto;
  min-height: 100px;
  padding: 0.5rem;
}

select[multiple] option {
  padding: 0.5rem;
  margin: 0.2rem 0;
  background: rgba(44, 44, 58, 0.8);
}
.stock-section {
  margin-top: 1.5rem;
}

.stock-section h4 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.stock-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.stock-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: fit-content;
  color: white;
  font-weight: 600;
  padding: 0.8rem 2rem;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  border: none;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.btn-submit {
  background: #4A90E2;
}

.btn-submit:hover {
  background: #3a7bc8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}
@media (max-width: 1200px) {
  .modal-wrapper {
    width: 900px;
  }
}

@media (max-width: 992px) {
  .modal-wrapper {
    width: 750px;
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding-top: 6rem;
  }

  .modal-wrapper {
    width: 90%;
    padding: 1.5rem;
    margin: 0 auto 3rem;
  }

  .modal-header h3 {
    font-size: 1.8rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .modal-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal-wrapper {
    padding: 1.5rem 1rem;
  }

  .modal-header h3 {
    font-size: 1.5rem;
  }

  .input, .select, .textarea {
    padding: 0.7rem 0.9rem;
    font-size: 0.9rem;
  }

  .btn {
    padding: 0.7rem 1.5rem;
  }
}

</style>
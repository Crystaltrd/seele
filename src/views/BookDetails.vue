<template>
  <div class="details-container">
    <Background />
    <button type="button" class="go-back-btn" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>

    <div class="container">
      <div class="content-wrapper" v-if="book">
        <div class="book-details">
          <div class="book-cover">
            <img :src="book.bookcover ? assetsurl + book.bookcover : require('../assets/bookcover.jpg')" :alt="book.booktitle + '\'s Cover'">
          </div>

          <div class="book-info">
            <h1>{{ book.booktitle }}</h1>

            <div class="meta-info">
              <p><strong>Publication year:</strong> {{ book.bookreleaseyear }}</p>
              <p><strong>Editor:</strong> {{ book.publisher }}</p>
              <p><strong>Type:</strong> {{ book.type }}</p>
              <p><strong>Category:</strong> {{ book.categoryName }}</p>
            </div>

            <div class="authors-section">
              <h3>Auteurs:</h3>
              <ul>
                <li v-for="author in book.authors" :key="author">{{ author }}</li>
              </ul>
            </div>

            <div class="languages-section">
              <h3>Langues:</h3>
              <ul>
                <li v-for="lang in book.langs" :key="lang">{{ lang }}</li>
              </ul>
            </div>

            <div class="stock-section">
              <h3>Avaibility:</h3>
              <div v-for="stock in book.stock" :key="stock.campus" class="stock-item">
                <span class="campus">{{ stock.campus }}:</span>
                <span :class="['availability', stock.stock > 0 ? 'avail' : '']">
                  {{ stock.stock > 0 ? 'Avaible (' + stock.stock + ')' : 'Unavaible' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="loading" v-else>
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Background from "../components/background.vue";

const router = useRouter();
const route = useRoute();
const book = ref(null);
const assetsurl = ref(import.meta.env.VITE_ASSETS_URL || '');

const goBack = () => {
  router.push('/');
};

const fetchBookDetails = async () => {
  try {
    const serialnum = route.params.serialnum;
    const response = await fetch(`${import.meta.env.VITE_API_URL}query/book?serialnum=${serialnum}`, {
      method: "GET",
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include'
    });

    const data = await response.json();
    if (data.res && data.res.length > 0) {
      book.value = data.res[0];
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
  }
};

onMounted(() => {
  fetchBookDetails();
});
</script>

<style scoped>
.details-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
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

.container {
  max-width: 1200px;
  padding: 2rem 1rem;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  background: rgba(44, 44, 58, 0.1);
  backdrop-filter: blur(3px);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.book-details {
  display: flex;
  gap: 2rem;
  color: white;
}

.book-cover {
  flex: 0 0 300px;
}

.book-cover img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.book-info {
  flex: 1;
}

.book-info h1 {
  margin-top: 0;
  font-size: 2rem;
  color: #4a90e2;
}

.meta-info {
  margin: 1.5rem 0;
  line-height: 1.6;
}

.meta-info p {
  margin: 0.5rem 0;
}

.authors-section,
.languages-section,
.stock-section {
  margin: 1.5rem 0;
}

.authors-section h3,
.languages-section h3,
.stock-section h3 {
  margin-bottom: 0.5rem;
  color: #4a90e2;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin: 0.3rem 0;
}

.stock-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
}

.campus {
  min-width: 120px;
}

.availability {
  padding: 0.3rem 0.7rem;
  border-radius: 0.4rem;
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: uppercase;
  background: red;
  color: white;
}

.availability.avail {
  background: #4a90e2;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
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
  .book-details {
    flex-direction: column;
  }

  .book-cover {
    flex: 0 0 auto;
    max-width: 200px;
    margin: 0 auto;
  }
}
</style>
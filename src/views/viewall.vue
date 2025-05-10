<template>
  <div class="view-all-container">
    <Background/>

    <section id="view-all">
      <div class="container">
        <div class="content-wrapper">
          <h3 class="section-heading">{{ searchQuery ? `Search Results for "${searchQuery}"` : 'All Publications' }}
            <span v-if="searchQuery" class="clear-search" @click.stop="clearSearch">(Clear)</span></h3>

          <div class="publications-list" v-if="!loadingbooks">
            <div class="publication-row" v-for="book in filteredBooks" :key="book.serialnum" @click="goToBookDetails(book.serialnum)">
              <div class="cover-container">
                <img v-bind:alt="book.booktitle+'\'s Cover'" v-if="book.bookcover" v-bind:src="assetsurl+book.bookcover"/>
                <img v-bind:alt="book.booktitle+'\'s Cover PLACEHOLDER'" v-else src="../assets/bookcover.jpg"/>
              </div>

              <div class="book-info">
                <h4 class="book-title">{{ book.booktitle }}</h4>
                <div class="book-meta">
                  <span class="book-year">{{ book.bookreleaseyear }}</span>
                  <span class="book-publisher">{{ book.publisher }}</span>
                </div>
                <span class="availability avail" v-if="isAvailable(book) > 0">Available</span>
                <span class="availability" v-else>Unavailable</span>
              </div>
            </div>

            <div v-if="filteredBooks.length === 0" class="no-results">
              <p>No publications found for "{{ searchQuery }}"</p>
              <button @click="clearSearch" class="btn">Show all publications</button>
            </div>

            <div class="pagination-controls" v-if="totalPages > 1">
              <button
                  @click="prevPage"
                  :disabled="currentPage === 0"
                  class="pagination-btn"
              >
                <i class="fas fa-chevron-left"></i>
              </button>

              <div class="page-numbers">
                <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="{ active: currentPage === page }"
                    class="page-btn"
                >
                  {{ page + 1 }}
                </button>
              </div>

              <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages - 1"
                  class="pagination-btn"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <svg viewBox="25 25 50 50" v-else class="loading-spinner">
            <circle r="20" cy="50" cx="50"></circle>
          </svg>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import Background from "../components/background.vue";
import { useRoute } from 'vue-router';


export default defineComponent({
  components: {Background},
  data() {
    return {
      books: [],
      loadingbooks: true,
      currentPage: 0,
      itemsPerPage: 8,
      totalBooks: 0,
      maxVisiblePages: 5,
      searchQuery: '',
      isSearching: false,

    };
  },
  computed: {
    filteredBooks() {
      if (!this.searchQuery) return this.books;
      const query = this.searchQuery.toLowerCase();
      return this.books.filter(book =>
          book.booktitle.toLowerCase().includes(query) ||
          (book.publisher && book.publisher.toLowerCase().includes(query)) ||
          (book.bookreleaseyear && book.bookreleaseyear.toString().includes(query))
      );
    },
    totalPages() {
      return Math.ceil(this.totalBooks / this.itemsPerPage);
    },
    visiblePages() {
      const range = [];
      const start = Math.max(0, this.currentPage - Math.floor(this.maxVisiblePages / 2));
      const end = Math.min(this.totalPages - 1, start + this.maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      return range;
    }
  },
  methods: {
    async fetchBooks() {
      this.loadingbooks = true;
      try {
        let url ;

        if (this.searchQuery) {
          url = `${apiurl}search?q=${encodeURIComponent(this.searchQuery)}&limit=${this.itemsPerPage}&page=${this.currentPage}`;
        }else {
          url = `${apiurl}query/book?limit=${this.itemsPerPage}&page=${this.currentPage}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: { 'Accept': 'application/json' },
          credentials: 'include'
        });

        const data = await response.json();

        if (data.res) {
          this.books = data.res;
          this.totalBooks = data.nbrres || 0;
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        this.loadingbooks = false;
      }
    },
    clearSearch() {
      this.searchQuery = '';
      this.currentPage = 0;
      this.$router.push({ path: '/view', query: {} });
      this.fetchBooks();
    },

    goToBookDetails(serialnum) {
      this.$router.push(`/book/${serialnum}`);
    },
    performSearch() {
      this.currentPage = 0;
      this.fetchBooks();
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
        this.fetchBooks();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.fetchBooks();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    goToPage(page) {
      this.currentPage = page;
      this.fetchBooks();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  mounted() {
    const route = useRoute();

    if (route.query.q) {
      this.searchQuery = route.query.q;
    }
    this.fetchBooks();

    this.$watch(
        () => this.$route.query.q,
        (newQuery) => {
          this.searchQuery = newQuery || '';
          this.currentPage = 0;
          this.fetchBooks();
        }
    );
  },
});
</script>

<style scoped>
.view-all-container {
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
  padding: 2rem;
  width: 1100px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin-top: 120px;
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

.publications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.publication-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.publication-row:hover {
  background: rgba(74, 144, 226, 0.1);
  transform: translateX(5px);
}

.cover-container {
  flex-shrink: 0;
}

.cover-container img {
  width: 110px;
  height: 160px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.book-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.book-title {
  margin: 0;
  font-size: 1.2rem;
  color: white;
  font-weight: 500;
}

.book-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.availability {
  align-self: flex-start;
  background: red;
  color: white;
  padding: 0.3rem 0.7rem;
  border-radius: 0.4rem;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.avail {
  background: #4a90e2;
}

.btn {
  background: #4a90e2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn:hover {
  background: #3a7bc8;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.pagination-btn {
  background: rgba(74, 144, 226, 0.3);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(74, 144, 226, 0.7);
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.page-numbers {
  display: flex;
  gap: 0.5rem;
}
.page-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-search {
  font-size: 1rem;
  color: #4a90e2;
  cursor: pointer;
  transition: opacity 0.3s;
}

.clear-search:hover {
  opacity: 0.8;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: white;
}

.no-results p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.page-btn:hover {
  background: rgba(74, 144, 226, 0.5);
}

.page-btn.active {
  background: #4a90e2;
  font-weight: bold;
}

@media (max-width: 768px) {
  .page-numbers {
    gap: 0.3rem;
  }

  .page-btn, .pagination-btn {
    width: 35px;
    height: 35px;
    font-size: 0.8rem;
  }
}

.loading-spinner {
  width: 3.25em;
  margin: 2rem auto;
  display: block;
  transform-origin: center;
  animation: rotate4 2s linear infinite;
}

.loading-spinner circle {
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
  .content-wrapper {
    padding: 1.5rem;
    width: 100%;
  }

  .section-heading {
    font-size: 1.8rem;
  }

  .publication-row {
    gap: 1rem;
    padding: 0.8rem;
  }

  .book-title {
    font-size: 1rem;
  }

  .book-meta {
    font-size: 0.8rem;
    gap: 0.5rem;
    flex-direction: column;
  }
}

@media (max-width: 500px) {
  .section-heading {
    font-size: 1.5rem;
  }

  .publication-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .book-info {
    width: 100%;
  }
}
</style>
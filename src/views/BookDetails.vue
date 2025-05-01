<template>
  <div class="book-detail-container">
    <Background/>

    <section id="detail">
      <div class="container">
        <div class="content-wrapper">

           <div class="detail-content">
            <div class="book-cover">
              <img v-bind:alt="book.booktitle+'\'s Cover'" v-if="book.bookcover" v-bind:src="assetsurl+book.bookcover"/>
              <img v-bind:alt="book.booktitle+'\'s Cover PLACEHOLDER'" v-else src="../assets/bookcover.jpg"/>
            </div>

             <div class="book-header">
               <h1 class="book-title">{{ book.booktitle }}</h1>
               <div class="book-description">
                 <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                   incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                   exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                   irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                   pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                   deserunt mollit anim id est laborum."</p>
               </div>
             </div>
          </div>

          <div class="separator"></div>

          <div class="rent-section">
            <div class="rent-controls">
              <div class="input-field">
                <label>borrow duration :</label>
                <select id="category" class="select">
                  <option value="">3 days</option>
                  <option value="">5 days</option>
                  <option value="">1 week</option>
                </select>
              </div>

              <button class="btn" type="submit">
                <i class="fa-solid fa-cart-plus" style="color: #ffffff;"></i>
                <span>borrow</span>
              </button>
            </div>

            <div class="book-info">
                <div class="info-item">
                  <span class="info-label">Publisher:</span>
                  <span class="info-value">{{ book.publisher || 'Unknown' }}</span>
                </div>


              <div class="info-item">
                <span class="info-label">Publication Year:</span>
                <span class="info-value">{{ book.bookreleaseyear || 'Unknown' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Category:</span>
                <span class="info-value">{{ book.category || 'Unknown' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Language:</span>
                <span class="info-value">{{ book.langs || 'Unknown' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Campus:</span>
                <span class="info-value">{{ book.campus || 'Unknown' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Available:</span>
                <span class="info-value">{{ totalStock || 'Unknown' }} copies</span>
              </div>
            </div>
          </div>
          <div v-if="loading" class="loading-spinner">
            <svg viewBox="25 25 50 50">
              <circle r="20" cy="50" cx="50"></circle>
            </svg>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Background from "../components/background.vue"

export default defineComponent({
  components: { Background },
  props: {
    serialnum: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      book: {},
      loading: true,
      totalStock: 0
    }
  },
  methods: {
    calculateStock() {
      if (!this.book.stock) return 0
      return this.book.stock.reduce((total, item) => total + item.stock, 0)
    },
    async fetchBookDetails() {
      try {
        const response = await fetch(`${apiurl}query/book/${this.serialnum}`)
        const data = await response.json()
        this.loading = true;
        this.book = {};

        if (data.booktitle) {
          this.book = data
        }
        else if (data.res) {
          const foundBook = data.res.find(book => book.serialnum === this.serialnum)
          if (foundBook) {
            this.book = foundBook
          } else {
            console.error("book not found")
          }
        }

        this.totalStock = this.calculateStock()
      } catch (error) {
        console.error("Error fetching book details:", error)
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.fetchBookDetails()
  }
})
</script>

<style scoped>
.book-detail-container {
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
}

.book-header {
  flex: 1;
}


.book-title {
  font-size: 2.2rem;
  color: white;
  text-align: left;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin-left: 0;
}

.book-description {
  margin-top: 1.5rem;
}

.book-description p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.7;
  text-align: justify;
  margin: 0;
}

#detail {
  padding: 8rem 0;
  display: flex;
  align-items: center;
}

.detail-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.book-cover {
  width: 240px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.book-cover img {
  width: 100%;
  height: auto;
  display: block;
}

.publication-description p {
  color: white;
  font-size: 1rem;
  line-height: 1.6;
  text-align: justify;
  margin: 0;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
}

.loading-spinner svg {
  width: 3.25em;
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

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 200px;
}

label {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #4A90E2;
  width: 200px ;
  color: white;
  font-weight: 600;
  padding: 0.8rem 2rem;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  border: none;
  transition: all 0.3s ease;
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

.separator {
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 1.5rem 0;
}

.rent-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  margin-top: 1.5rem;
}

label {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
}

.select {
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
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
}

.rent-section {
  display: flex;
  gap: 3rem;
  margin-top: 1.5rem;
}

.book-info {
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  gap: 1rem;
  width: 100%;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.info-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: white;
  font-size: 1rem;
  font-weight: 500;
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
<template>
  <div class="book-detail-container">
    <Background/>

    <section id="detail">
      <div class="container">
        <div class="content-wrapper">
          <h3 class="book-title">{{ book.booktitle}}</h3>

          <div v-if="loading" class="loading-spinner">
            <svg viewBox="25 25 50 50">
              <circle r="20" cy="50" cx="50"></circle>
            </svg>
          </div>

          <div class="publication-grid">

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
      assetsurl: "https://crystal.tilde.institute/mellow/",
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
        const response = await fetch(`https://crystal.midori-ai.xyz/cgi-bin/query/book/${this.serialnum}`)
        const data = await response.json()

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
  padding: 0 1.5rem;
  width: 1100px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.book-title {
  font-size: 2.2rem;
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
  font-weight: 600;
  letter-spacing: 1px;
}

#detail {
  padding: 8rem 0;
  display: flex;
  align-items: center;
}

.publication-grid {
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  scrollbar-width: none;
  justify-content: center;
  flex-wrap: wrap;
}

.publication-grid::-webkit-scrollbar {
  display: none;
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
</style>
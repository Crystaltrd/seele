<template>
  <div class="home-container">
    <Background/>

    <section id="popular">
      <div class="container">
        <div class="content-wrapper">
          <h3 class="section-heading">Popular Publications</h3>

          <div class="publications-grid">
            <template v-for="book in books" v-if="!loadingbooks">
              <div class="publication" v-bind:id="'PUBSN'+book.serialnum" @click="goToBookDetails(book.serialnum)">
                <img v-bind:alt="book.booktitle+'\'s Cover'" v-if="book.bookcover" v-bind:src="covers_url+book.bookcover"/>
                <img v-bind:alt="book.booktitle+'\'s Cover PLACEHOLDER'" v-else src="../assets/bookcover.jpg"/>

                <span class="release-year">{{ book.bookreleaseyear }}</span>
                <div class="publication-info">

                  <span class="availability avail" v-if="this.isAvailable(book) > 0">Available</span>
                  <span class="availability" v-else>Unavailable</span>
                  <h4 class="title">{{ book.booktitle }}</h4>

                </div>
              </div>
            </template>

            <svg viewBox="25 25 50 50" v-else >
              <circle r="20" cy="50" cx="50"></circle>
            </svg>
          </div>
        </div>
      </div>
    </section>
    <button type="button" class="see-all-btn" @click="seeAll">
      <i class="fas fa-arrow-right"></i>View All
    </button>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import Background from "../components/background.vue";

export default defineComponent({
  components: {Background},
  data() {
    return {
      books: "",
      limit: 5,
      covers_url: pubURL,
      loadingbooks: true,
    };
  },
  methods: {
    seeAll (){
      this.$router.push('/view');
    },
    goToBookDetails(serialnum) {
      this.$router.push(`/book/${serialnum}`);
    },
    isAvailable(book) {
      let n = 0;
      for (const stockElement of book.stock) {
        n += stockElement.stock;
      }
      console.log(n)
      return n
    },
    async getBooks() {
      this.serverError = "";
      try {

        const queryParams = new URLSearchParams({
          limit: this.limit,
        });
        const response = await fetch(apiurl+`query/book?${queryParams.toString()}`, {
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
            this.books = jsonResponse.res;
            this.loadingbooks = false;

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
  },
  beforeMount() {
    this.getBooks()
  }
})
</script>

<style scoped>
.home-container {
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

#popular {
  padding: 8rem 0;
  display: flex;
  align-items: center;
}

.publications-grid {
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  scrollbar-width: none;
  justify-content: center;
  flex-wrap: wrap;
}

.publications-grid::-webkit-scrollbar {
  display: none;
}

.publication {
  width: 180px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.publication:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.publication img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
}

.publication-info {
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  color: white;
}

.availability {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
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

.title {
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  text-align: center;
}

.release-year {
  position: absolute;
  bottom: 3.6rem;
  right: 0.8rem;
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  color: white;
  padding: 0.3rem 0.7rem;
  border-radius: 0.4rem;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 2;
  backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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

.see-all-btn {
  margin-left: auto;
  margin-bottom: 5rem;
  background: rgba(74, 144, 226, 0.2);
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  z-index: 9999; /* just temporary to make the btn work */
  position: relative;
}

.see-all-btn:hover {
  background: rgba(74, 144, 226, 0.1);
  transform: translateX(-3px);
}

.see-all-btn i {
  font-size: 0.8rem;
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
  .section-heading {
    font-size: 1.8rem;
  }

  .content-wrapper {
    padding: 1.5rem;
  }

  .publication {
    width: 150px;
  }

  .publication img {
    height: 220px;
  }
}

@media (max-width: 500px) {
  #popular {
    padding: 3rem 0;
  }

  .publication {
    width: 130px;
  }

  .publication img {
    height: 190px;
  }

  .title {
    font-size: 0.9rem;
  }

  .availability {
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
  }

  @media (max-width: 768px) {
    .content-wrapper {
      width: 100%;
      padding: 1rem;
    }

    .publications-grid {
      gap: 1rem;
    }
  }

  @media (max-width: 500px) {
    .publication {
      width: 45%;
      min-width: 120px;
    }

    .publication img {
      height: auto;
      aspect-ratio: 2/3;
    }
  }

  .content-wrapper {
    width: 100%;
    max-width: 1100px;
  }

  .publication {
    width: calc(20% - 2rem);
  }

  @media (max-width: 1024px) {
    .publication {
      width: calc(25% - 2rem);
    }
  }

}
</style>
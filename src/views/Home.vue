<template>
  <div class="home-container">
    <Background />

    <section id="popular">
      <div class="container">
        <div class="content-wrapper">
          <h3 class="section-heading">Popular Publications</h3>

          <div class="publications-grid">
            <div class="publication" v-for="i in 5" :key="i">
              <img alt="Book cover" src="../assets/bookcover.jpg">
              <div class="publication-info">
                <span class="availability">Available</span>
                <h4 class="title">Publication Title</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
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
  background: rgba(41, 68, 95, 0.1);
  backdrop-filter: blur(3px);
  border-radius: 20px;
  padding: 0 1.5rem;
  width: 1100px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
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
  background: #4a90e2;
  color: white;
  padding: 0.3rem 0.7rem;
  border-radius: 0.4rem;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
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
}
</style>
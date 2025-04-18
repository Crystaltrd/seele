<template>
  <div class="about-container">
    <Background />

    <section class="abtAlexandria-section">
      <div class="container">
        <div class="section-header">
          <h2>About Alexandria</h2>
        </div>

        <div class="content-grid">
          <div class="text-content">
            <p>
              The name <strong>Alexandria</strong> is not random. It pays homage to the famous
              <em>Library of Alexandria</em>, founded in the 3rd century BC in Ancient Egypt.
              It was one of the greatest intellectual centers in history, aiming to gather all
              human knowledge in one place.
            </p>
            <p>
              At its peak, the library housed hundreds of thousands of scrolls from across
              the known world, translated into Greek and preserved. It stood as a symbol of
              curiosity, intellectual diversity, and cultural dialogue. Despite its tragic
              destruction, the legacy of the Library lives on as a beacon of knowledge
              sharing and preservation.
            </p>
          </div>

          <div class="image-content">
            <figure>
              <img src="../assets/alexandria_library.jpg" alt="Ancient Library of Alexandria" class="section-image" />
              <figcaption>Artistic impression of the Ancient Library</figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="section-header">
          <h2>Why Alexandria ?</h2>
        </div>

        <div class="content-grid reverse">
          <div class="text-content">
            <p>
              The Alexandria website was created to meet a simple yet essential need: to
              make bibliographic resources more accessible for students and professors. It is
              a digital library management platform, designed to be intuitive, fast, functional,
              and scalable.
            </p>
            <p>
              Thanks to a modern interface, users can:
            </p>
            <ul class="feature-list">
              <li>Search for any publication using simple or advanced search</li>
              <li>Access detailed records of the different available publications</li>
              <li>Discover new arrivals, most borrowed books, or recommended titles</li>
            </ul>
            <p>
              All of this in a clear and pleasant space, designed by students, for students and all the university's Community.
            </p>
          </div>

          <div class="image-content">
            <figure>
              <img src="../assets/alexandriaaa.jpg" alt="Alexandria website interface" class="section-image" />
              <figcaption>Alexandria website interface</figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="section-header">
          <h2>About University</h2>
        </div>

        <div class="content-grid">
          <div class="text-content">
            <p>
              Abderrahmane Mira University of Béjaïa, located in the beautiful coastal city
              of Béjaïa, is a recognized, dynamic institution of higher education.
              It offers a wide range of programs in various fields, including science,
              technology, medicine, law, humanities, and computer science.
            </p>
            <p>
              The Targa Ouzemour campus, nestled between the sea and mountains,
              is a space for knowledge, research, and life. It is in this stimulating
              environment, rich in culture and conducive to reflection, that we
              developed Alexandria.
            </p>
            <p>
              We are proud to represent our university through this project and contribute
              to it, at our level, with an innovative digital solution.
            </p>
          </div>

          <div class="image-content">
            <figure>
              <img src="../assets/univpic.jpg" alt="University campus" class="section-image" />
              <figcaption>Abderrahmane Mira University campus</figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="section-header">
          <h2>About Us</h2>
        </div>

        <div class="content-grid reverse">
          <div class="text-content">
            <p>
              Alexandria is the result of a collaborative university project,
              by a group of four students in second-year computer engineering at the
              Abderrahmane Mira University of Béjaïa.
            </p>
            <p>
              Each team member contributed their skills, creativity, and dedication to bringing this project to life.
              The work was divided into two main areas:
            </p>
            <ul class="feature-list">
              <li><strong>Frontend</strong>: design, usability, smooth navigation, accessibility</li>
              <li><strong>Backend</strong>: data structure, secure user management, server-side logic, database, API</li>
            </ul>
            <p>
              This project allowed us to combine our theoretical learning with a practical, collaborative
              application that serves a real purpose in our academic environment.
            </p>
          </div>

          <div class="image-content">
            <figure>
              <img src="../assets/team_pic.jpg" alt="Development team" class="section-image" />
              <figcaption>The Alexandria development team</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Background from "../components/background.vue";
</script>

<style scoped>
.about-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 3rem 1.5rem;
  background-color: transparent;
}

section {
  position: relative;
  z-index: 1;
  margin: 4rem auto;
  padding: 2.5rem 2rem;
  max-width: 1100px;
  width: 100%;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.section-header {
  text-align: left;
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
  margin-bottom: 1.5rem;
}

.section-header h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 270px ;
  transform: translateX(-50%);
  width: 550px;
  height: 4px;
  background: linear-gradient(90deg, #4A90E2, transparent);
  border-radius: 2px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 4rem;
}

.content-grid.reverse {
  grid-template-columns: 0.8fr 1.2fr;
}

.content-grid.reverse .text-content {
  order: 2;
}

.content-grid.reverse .image-content {
  order: 1;
}

.text-content p {
  color: white;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.feature-list {
  color: white;
  margin: 1.5rem 0;
  padding-left: 1.5rem;
  line-height: 1.8;
}

.feature-list li {
  margin-bottom: 0.8rem;
  position: relative;
}

.feature-list li::before {
  content: '•';
  color: #4A90E2;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.image-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.section-image {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.section-image:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

figcaption {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .content-grid,
  .content-grid.reverse {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .content-grid.reverse .text-content,
  .content-grid.reverse .image-content {
    order: initial;
  }

  .image-content {
    order: -1;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  section {
    padding: 1.5rem;
    margin: 2rem auto;
  }
}
</style>
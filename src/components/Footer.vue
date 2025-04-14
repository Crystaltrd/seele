<template>
  <footer class="footer-container">
    <div class="footer-content">
      <ul class="social-icons">
        <li class="social-item">
          <a href="https://www.univ-bejaia.dz/" class="social-link">
            <img alt="Website" src="../assets/website.png" class="social-icon">
          </a>
        </li>
        <li class="social-item">
          <a href="https://www.facebook.com/Universite.A.M.Bejaia" class="social-link">
            <img alt="Facebook" src="../assets/facebook%20(1).png" class="social-icon">
          </a>
        </li>
        <li class="social-item">
          <a href="https://x.com/U_BEJAIA" class="social-link">
            <img alt="Twitter" src="../assets/twitter%20(1).png" class="social-icon">
          </a>
        </li>
        <li class="social-item">
          <a href="https://www.youtube.com/channel/UCy1xyOl5MEuzfZhcPIg8DsQ" class="social-link">
            <img alt="YouTube" src="../assets/youtube.png" class="social-icon">
          </a>
        </li>
        <li class="social-item">
          <a href="mailto:webmaster.bejaia@univ-bejaia.dz" class="social-link">
            <img alt="Email" src="../assets/email.png" class="social-icon">
          </a>
        </li>
      </ul>
      <p class="copyright">
        © The University of Abderrahmane mira's name and its logo are reserved.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer-container {
  width: 100%;
  padding: 20px 0;
  backdrop-filter: blur(10px);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin: 0;
  padding: 0;
}

.social-item {
  list-style: none;
  transition: transform 0.2s ease;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.social-item:hover {
  transform: translateY(-3px);
}

.social-item:hover .social-icon {
  opacity: 0.9;
  filter: invert(39%) sepia(99%) saturate(742%) hue-rotate(176deg) brightness(93%) contrast(91%);
}

.copyright {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  text-align: center;
  margin: 0;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .social-icons {
    gap: 15px;
  }

  .social-icon {
    width: 20px;
    height: 20px;
  }

  .copyright {
    font-size: 0.7rem;
  }
}
</style>

<script setup lang="ts">
</script>
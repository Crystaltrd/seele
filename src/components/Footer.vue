<template>
  <footer>
    <ul class="social-icon">
      <li><a href="#"><i class="fa-brands fa-facebook"></i></a></li>
      <li><a href="#"><i class="fa-brands fa-youtube"></i></a></li>
      <li><a href="#"><i class="fa-brands fa-x-twitter"></i></a></li>
      <li><a href="#"><i class="fa-solid fa-chalkboard"></i></a></li>
      <li><a href="#"><i class="fa-solid fa-envelope"></i></a></li>
    </ul>
    <p>© The name "The Alexandria Library" and its logo are reserved.</p>
  </footer>
</template>

<style scoped>
footer {
  width: 100%;
  padding: 10px 0;
  background: rgba(44, 44, 58, 0.1);
  backdrop-filter: blur(3px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
}

.social-icon {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 3px 0;
  padding: 0;
}

.social-icon li {
  list-style: none;
}

.social-icon li a {
  font-size: 1.2rem;
  color: white;
  transition: transform 0.3s ease, color 0.3s ease;
}

.social-icon li a:hover {
  transform: translateY(-4px);
  color: #4A90E2 ;
}

footer p {
  color: white;
  font-size: 0.7rem;
  text-align: center;
  margin: 5px 0 0;
}
</style>

<script setup lang="ts">
</script>

<template>
  <vue-particles
      id="tsparticles"
      @particles-loaded="particlesLoaded"
      :options="particlesOptions"
  />
</template>

<script setup>
import { ref } from "vue";

const particlesOptions = ref({
  background: {
    color: {
      value: "#050320",
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      outModes: "bounce",
    },
    number: {
      value: 110,
      density: {
        enable: true,
      },
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 0.5, max: 3 },
      random : true
    },
  },
  detectRetina: true,
});


const particlesLoaded = async (container) => {
  console.log("Particles container loaded", container);
};
</script>

<style scoped>
#tsparticles {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top : 0;
  left: 0;
}
</style>

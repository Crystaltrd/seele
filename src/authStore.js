import { ref, watch } from 'vue';

const savedAuth = localStorage.getItem('isAuthenticated') === 'true';
export const isAuthenticated = ref(savedAuth);

watch(isAuthenticated, (value) => {
    localStorage.setItem('isAuthenticated', value);
});

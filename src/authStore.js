import { ref, watch } from 'vue';

const savedAuth = localStorage.getItem('isAuthenticated') === 'true';
export const isAuthenticated = ref(savedAuth);

export const userDisplayName = ref(localStorage.getItem('userDisplayName') || '');

watch(isAuthenticated, (value) => {
    localStorage.setItem('isAuthenticated', value);
    if (!value) {
        localStorage.removeItem('userDisplayName');
    }
});

watch(userDisplayName, (value) => {
    if (value) {
        localStorage.setItem('userDisplayName', value);
    }
});
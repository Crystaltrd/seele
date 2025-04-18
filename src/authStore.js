import { ref } from 'vue';

const savedAuth = localStorage.getItem('isAuthenticated') === 'true';
export const isAuthenticated = ref(savedAuth);

export const userDisplayName = ref(localStorage.getItem('userDisplayName') || '');

export function setAuth(authenticated, displayName = '') {
    isAuthenticated.value = authenticated;
    userDisplayName.value = displayName;

    localStorage.setItem('isAuthenticated', authenticated);
    if (displayName) {
        localStorage.setItem('userDisplayName', displayName);
    }
    if (!authenticated) {
        localStorage.removeItem('userDisplayName');
    }
}
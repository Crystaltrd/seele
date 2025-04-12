import { ref } from 'vue';

const savedAuth = localStorage.getItem('isAuthenticated') === 'true';
export const isAuthenticated = ref(savedAuth);

export const userDisplayName = ref(localStorage.getItem('userDisplayName') || '');
export const sessionId = ref(localStorage.getItem('sessionId') || '');

export function setAuth(authenticated, displayName = '', session = '') {
    isAuthenticated.value = authenticated;
    userDisplayName.value = displayName;
    sessionId.value = session;

    localStorage.setItem('isAuthenticated', authenticated);
    if (displayName) {
        localStorage.setItem('userDisplayName', displayName);
    }
    if (session) {
        localStorage.setItem('sessionId', session);
    }

    if (!authenticated) {
        localStorage.removeItem('userDisplayName');
        localStorage.removeItem('sessionId');
    }
}
import { ref } from 'vue';

const savedAuth = localStorage.getItem('isAuthenticated') === 'true';
export const isAuthenticated = ref(savedAuth);

export const userDisplayName = ref(localStorage.getItem('userDisplayName') || '');
export const sessionID = ref(localStorage.getItem('sessionID') || '');

export function setAuth(authenticated, displayName = '', session = '') {
    isAuthenticated.value = authenticated;
    userDisplayName.value = displayName;
    sessionID.value = session;

    localStorage.setItem('isAuthenticated', authenticated);
    if (displayName) {
        localStorage.setItem('userDisplayName', displayName);
    }
    if (session) {
        localStorage.setItem('sessionID', session);
    }

    if (!authenticated) {
        localStorage.removeItem('userDisplayName');
        localStorage.removeItem('sessionID');
    }
}
// src/utils/authEvents.js
export const AUTH_STATE_CHANGED = 'authStateChanged';

export const notifyAuthStateChanged = () => {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED));
};
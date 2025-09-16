export const sessionStore = {
    get(key) {
      const value = sessionStorage.getItem(key);
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    },
    set(key, value) {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
      sessionStorage.removeItem(key);
    },
    clear() {
      sessionStorage.clear();
    }
  };
  
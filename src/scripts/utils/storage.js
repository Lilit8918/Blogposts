export class Storage {
  static getItem(key) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        return null;  // Return null instead of false
      }
      return JSON.parse(value);
    } catch (error) {
      console.error("Error reading from localStorage", error);  // Log error
      return null;  // Return null in case of any parsing errors
    }
  }

  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error writing to localStorage", error);  // Log error
      return false;
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing item from localStorage", error);  // Log error
      return false;
    }
  }

  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage", error);  // Log error
      return false;
    }
  }
}

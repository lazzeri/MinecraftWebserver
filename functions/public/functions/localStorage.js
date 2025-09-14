const localStorageHelper = {
  getItem(key) {
    const item = localStorage.getItem(key);

    if (!item) {
      console.warn(`No item found in localStorage for key: "${key}"`);
      return null;
    }

    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  },

  setItem(key, value) {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (err) {
      console.error(`Failed to set localStorage key "${key}":`, err);
    }
  },

  updateObjItem(key, newValues) {
    const oldItem = this.getItem(key);

    if (!oldItem || typeof oldItem !== 'object') {
      this.setItem(key, newValues);
      return;
    }

    // Assumes `updateObj` merges objects. If not defined, you could use Object.assign or spread:
    // const updated = { ...oldItem, ...newValues };
    updateObj(oldItem, newValues);

    this.setItem(key, oldItem);
  },

  removeItem(key) {
    localStorage.removeItem(key);
  },
};

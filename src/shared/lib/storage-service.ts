export const getItem = (key: string) => {
  return localStorage.getItem(key);
};

export const setItem = (key: string, value: string) => {
  return localStorage.setItem(key, value);
};

export const removeItem = (key: string) => {
  return localStorage.removeItem(key);
};

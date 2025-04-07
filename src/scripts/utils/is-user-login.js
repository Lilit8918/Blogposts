import { Storage } from "./storage.js";

export const isUserLogin = () => {
  const user = Storage.getItem("user");
  const token = Storage.getItem("token");
  if (user && token) {
    return true;
  }
  return false;  // If user or token is not found, return false
};

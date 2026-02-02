const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_FRONT_URL
    : "http://localhost:3001";

export default API_URL;
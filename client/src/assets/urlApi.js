// export const urlApi='https://server-bendahan.onrender.com/'
//export const urlApi='http://localhost:3001/'
const urlApiL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:3001";

export default urlApiL;
import axios from "axios";

let token;
const tokenString = localStorage.getItem("user_data");
if (tokenString) {
  const tokenConverted = JSON.parse(tokenString);
  token = tokenConverted.token;
}
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    Authorization: "Token " + token,
  },
});

export default axiosInstance;

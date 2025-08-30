import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://192.168.139.28:4000/api",
  withCredentials: true,
});

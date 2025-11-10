import axios from "axios";

// 🌍 Base URL for your backend (adjust if needed)
const BASE_URL = import.meta.env.VITE_ADMIN_API_URL || "http://localhost:3019/user";

// Axios instance
export const user = axios.create({
  baseURL: BASE_URL,
});

// 🔐 Attach token to each request if it exists
user.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚫 Handle unauthorized responses globally
user.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — redirecting to login");
      localStorage.removeItem("userToken");
      window.location.href = "/user/loginuser";
    }
    return Promise.reject(error);
  }
);



export const userlogin = async(data)=>{
  const response = await user.post("/loginuser",data);
  return response.data;
}
export const registeruserprofile = async(data)=>{
  
    const response = await user.post("/registeruser",data);
    return response.data;

}


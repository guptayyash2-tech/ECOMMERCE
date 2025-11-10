import axios from "axios";

// 🌍 Base URL for your backend (adjust if needed)
const BASE_URL = import.meta.env.VITE_ADMIN_API_URL || "http://localhost:3019";

// Axios instance
export const admin = axios.create({
  baseURL: BASE_URL,
});

// 🔐 Attach token to each request if it exists
admin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚫 Handle unauthorized responses globally
admin.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — redirecting to login");
      localStorage.removeItem("adminToken");
      window.location.href = "/otp/login";
    }
    return Promise.reject(error);
  }
);

// ==============================
// 📦 API FUNCTIONS
// ==============================

// 1️⃣ Send OTP for registration
export const sendAdminOtp = async (formData) => {
  const response = await admin.post("/otp/otpsend", formData);
  return response.data;
};

// 2️⃣ Verify OTP and complete registration
export const verifyAdminOtp = async (data) => {
  const response = await admin.post("/otp/verifyotp", data);
  return response.data;
};

export const adminlogin = async(data)=>{
  const response = await admin.post("/admin/loginadmin",data);
  return response.data;
}
export const registeradminprofile = async(formData,data)=>{
  
    const response = await admin.post("/admin/registercompanyprofile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;

}

export const getcompanyprofile= async(data)=>{
  const response = await admin.get("/admin/getcompanyprofile",data);
  return response.data;
}

export const postregisterproduct = async (data) => {
  const response = await admin.post("/admin/registerproduct", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;}
  export const getProducts= async(data)=>{
  const response = await admin.get("/admin/getregisterproduct",data);
  return response.data;
}
export const getproductbyid = async(id)=>{
  const response = await admin.get(`/admin/getproductsbyid/${id}`);
  return response.data;
}
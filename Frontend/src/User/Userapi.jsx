import axios from "axios";

// 🌍 Base URL for your backend (adjust if needed)
const BASE_URL =
  import.meta.env.VITE_ADMIN_API_URL || "http://localhost:3019/user";

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

// ==================== 🔽 USER AUTH & PROFILE ====================

export const userlogin = async (data) => {
  const response = await user.post("/loginuser", data);
  return response.data;
};

export const registeruserprofile = async (data) => {
  const response = await user.post("/registeruser", data);
  return response.data;
};

export const getuserprofile = async () => {
  const response = await user.get("/getuser");
  return response.data;
};

export const updateuser = async (data) => {
  const response = await user.put("/updateuser", data);
  return response.data;
};

// ==================== 🔽 USER PERSONAL INFO ====================

export const createpersonal = async (data) => {
  const response = await user.post("/createpersonaluser", data);
  return response.data;
};

export const getuserpersonal = async () => {
  const response = await user.get("/getpersonaluser");
  return response.data;
};

export const updateuserpersonal = async (data) => {
  const response = await user.put("/updatepersonaluser", data);
  return response.data;
};

// 🗑 Delete user personal info
export const deleteuserpersonal = async () => {
  const response = await user.delete("/deletepersonaluser");
  return response.data;
};

export const getallcompanyproducts = async () => {
  const response = await user.get("/getallcompanyproducts");
  return response.data;
}



export const getallcompanyproductsbyid = async (id) => {
  const response = await user.get(`/getallcompanyproducts/${id}`);
  return response.data;
}

export const addtocart = async (data) => {
  const response = await user.post("/addtocart", data);
  return response.data;
};
export const getcartbyuser = async () => {
  const response = await user.get("/getcart");
  return response.data;
};


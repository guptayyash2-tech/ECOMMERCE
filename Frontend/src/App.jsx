import React from "react";

import { Route, Router, Routes } from "react-router";
import Register from "./Admin/Registerhome";
import AdminLogin from "./Admin/Login";
import AdminDashboard from "./Home";
import AdminCompanyProfileForm from "./Admin/Registercompany";
import AdminCompanyList from "./Admin/Getcomonayprofile";
import Dashboard from "./Home";
import RegisterProduct from "./Admin/Registerproduct";
import ProductListing from "./Admin/Getproduct";
import ProductDetails from "./Admin/Proudctbyid";
import Adminhome from "./Admin/Adminhome";
import UserRegister from "./User/Userregisterprofile";
import UserLogin from "./User/Loginuser";





function App() {
  return (
    <div>
     
    <Routes>
 <Route path="/" element={<Dashboard/>}/>
 <Route path="/admin" element={<Adminhome/>}/>
         <Route path="/otp/otpsend" element={<Register />} />
         <Route path="/admin/loginadmin" element={<AdminLogin/>} />
         <Route path="/admin/registercompanyprofile" element={<AdminCompanyProfileForm/>}/>

   <Route path="/admin/getcompanyprofile" element={<AdminCompanyList/>}/>


 <Route path="/admin/registerproduct" element={<RegisterProduct/>}/>

 <Route path="/admin/getregisterproduct" element={<ProductListing/>}/>
 <Route path="/admin/getproductsbyid/:id" element={<ProductDetails/>}/>


<Route path="/user/registeruser" element={<UserRegister/>}/>
<Route path="/user/loginuser" element={<UserLogin/>}/>

     </Routes>
   
    
    </div>
  );
}

export default App;

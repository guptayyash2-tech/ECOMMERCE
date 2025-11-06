import React from "react";

import { Route, Router, Routes } from "react-router";
import Register from "./Admin/Registerhome";
import AdminLogin from "./Admin/Login";
import AdminDashboard from "./Home";
import AdminCompanyProfileForm from "./Admin/Registercompany";
import AdminCompanyList from "./Admin/Getcomonayprofile";
import Dashboard from "./Home";





function App() {
  return (
    <div>
     
    <Routes>
 <Route path="/" element={<Dashboard/>}/>
         <Route path="/otp/otpsend" element={<Register />} />
         <Route path="/admin/loginadmin" element={<AdminLogin/>} />
         <Route path="/admin/registercompanyprofile" element={<AdminCompanyProfileForm/>}/>

   <Route path="/admin/getcompanyprofile" element={<AdminCompanyList/>}/>





     </Routes>
   
    
    </div>
  );
}

export default App;

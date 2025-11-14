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
import GetUserProfile from "./User/Getuser";
import UserDashboard from "./User/Userhome";
import UpdateUserProfile from "./User/Updateuserprofile";
import CreateUserPersonal from "./User/Createpersonal";
import GetUserPersonal from "./User/Getcreatepersonal";
import UpdateUserPersonal from "./User/Updateuserpersonal";
import GetAllProducts from "./User/products/Getproducts";
import GetproductDetails from "./User/products/Getproductbyid";
import AddToCart from "./User/products/Addtocart";
import CheckoutPage from "./User/products/Order";





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
<Route path="/user/getuser" element={<GetUserProfile/>}/>

<Route path="/user" element={<UserDashboard/>}/>

<Route path="/user/updateuser" element={<UpdateUserProfile/>}/>
<Route path="/user/createpersonaluser" element={<CreateUserPersonal/>}/>
<Route path="/user/getpersonaluser" element={<GetUserPersonal/>}/>
<Route path="/user/updatepersonaluser" element={<UpdateUserPersonal/>}/>

<Route path="/user/getallproducts" element={<GetAllProducts/>}/>
<Route path="/user/getallcompanyproducts/:id" element={<GetproductDetails/>}/>
<Route path="/user/addtocart" element={<AddToCart/>}/>
<Route path="/user/createorder" element={<CheckoutPage/>}/>
     </Routes>
   
    
    </div>
  );
}

export default App;

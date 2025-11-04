import React from "react";

import { Route, Router, Routes } from "react-router";
import Register from "./Admin/Registerhome";





function App() {
  return (
    <div>
    <Routes>
         <Route path="/otp/otpsend" element={<Register />} />






     </Routes>
   
    
    </div>
  );
}

export default App;

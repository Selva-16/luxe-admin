import React from "react";
import Sidebar from "./admin/sidebar";
import { Route, Routes } from "react-router-dom";
import Users from "./admin/users";
import Orders from "./admin/orders";
import Dashboard from "./admin/dashboard";
import Products from "./admin/products";

function App(){
  return(
     <><Sidebar /><Routes>
       <Route path="/admin/dashboard" element={ <Dashboard /> } />
       <Route path="/admin/orders" element={ <Orders /> } />
       <Route path="/admin/products" element={ <Products /> } />
       <Route path="/admin/users" element={<Users />} />
     </Routes></>
    
  );
}

export default App;

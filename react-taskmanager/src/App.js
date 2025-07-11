// src/App.js
import React from "react";
import axios from 'axios';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import ManagingTasks from "./components/ManagingTasks";
import AddingTasks from "./components/AddingTasks";




axios.defaults.withCredentials = true;


function App() {
  return (
    <Router>
      <Navbar /> {/* Global Navbar — appears once */}
      <Routes>
       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/AddingTasks" element={<AddingTasks />} />
        <Route path="/manage-tasks" element={<ManagingTasks />} />

       
       
    
      </Routes>
    </Router>
  );
}

export default App;

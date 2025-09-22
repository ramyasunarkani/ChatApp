import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Navbar from './components/Navbar'

import {useDispatch, useSelector} from 'react-redux';
import { checkAuth } from './Store/authActions'
import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import ProfilePage from './pages/ProfilePage';


const App = () => {
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(checkAuth())

  },[])
  const {authUser,isCheckingAuth}=useSelector(state=>state.auth);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
    
  return (
    <div>
    <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />


        
      </Routes>
      <Toaster />

    </div>
  )
}

export default App
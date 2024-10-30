import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from "./Login"
import Register from "./Register"
import ForgetPassword from "./ForgetPassword"
import ChangePassword from "./ChangePassword"
export default function Auth() {
  return (
    <Routes>
      <Route index element={<Login/>}/>
      <Route path='register' element={<Register/>} />
      <Route path='forgetpassword' element ={<ForgetPassword/>}/>
      <Route path='changepassword' element ={<ChangePassword/>}/>
    </Routes>
  )
}

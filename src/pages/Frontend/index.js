import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./Home"
import Product from "./Product"
export default function Auth() {
  return (
    <Routes>
      <Route index element={<Home/>}/>
      <Route path='products' element={<Product/>} />
    </Routes>
  )
}

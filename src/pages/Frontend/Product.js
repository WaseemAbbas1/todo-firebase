import React from 'react'
import { useAuthContext } from '../../context/AuthContext'
export default function Product() {
  const {isAuth}= useAuthContext()
  console.log('isAuth', isAuth)
  return (
    <div>Product</div>
  )
}

import { useAuthContext } from 'context/AuthContext'
import React from 'react'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({Component}) {
const {isAuth} = useAuthContext()
   
if(!isAuth)
{
return<Navigate to="/auth/"/>
}
return (
    <Component/>
  )
}

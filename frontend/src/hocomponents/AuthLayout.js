import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { auth } from '../state/auth/authActions'

const AuthLayout = () => {
  const isAuth = useSelector(state => state.auth.isAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(auth())
    
    if (isAuth === true) navigate('/')
  })
  
  return (
    <Outlet/>
  )
}

export default AuthLayout
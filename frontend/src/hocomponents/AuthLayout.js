import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { auth } from '../state/auth/authActions'

const AuthLayout = () => {
  const isAuth = useSelector(state => state.auth.isAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dark = useSelector(state => state.auth.dark)
  
  useEffect(() => {
    if (dark) {
      document.documentElement.style.setProperty('--bg-clr-1', "#000000");
    }
    else {
      document.documentElement.style.setProperty('--bg-clr-1', "#ffffff");
    }
    dispatch(auth())
    
    if (isAuth === true) navigate('/')
  })
  
  return (
    <Outlet/>
  )
}

export default AuthLayout
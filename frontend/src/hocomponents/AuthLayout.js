import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { auth } from '../state/auth/authActions'
import { darkTheme, lightTheme } from '../utils/themes';
import { ReactComponent as Github } from '../svg/github.svg'
import { Link } from 'react-router-dom';

const AuthLayout = () => {
  const isAuth = useSelector(state => state.auth.isAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dark = useSelector(state => state.auth.dark)
  
  useEffect(() => {
    if (dark) {
      for (var key of Object.keys(darkTheme)) {
        document.documentElement.style.setProperty(key, darkTheme[key]);
      }
    }
    else {
      for (var key of Object.keys(lightTheme)) {
        document.documentElement.style.setProperty(key, lightTheme[key]);
      }
    }
    dispatch(auth())
    
    if (isAuth === true) navigate('/')
  })
  
  return (
    <React.Fragment>
      <Outlet/>
      <a href="https://github.com/alexjmpb/scheduleit/" target="_blank" rel="noreferrer">
        <Github className="github"/>
      </a>
    </React.Fragment>
  )
}

export default AuthLayout
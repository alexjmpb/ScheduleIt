import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Form from '../components/Form'
import Input from '../components/Input'
import { loginSuccess, loginFail, cleanSubmit, submitRequest } from '../state/auth/authActions'
import { Link } from 'react-router-dom'
import { ReactComponent as AuthImage } from '../svg/login-image1.svg'
import { axiosInstance, axiosInstanceUnauth } from '../axios'
import Submit from '../components/Submit'
import { useAlert } from 'react-alert'

const LoginPage = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: ''
  })
  const dispatch = useDispatch();
  const [validators, setValidators] = useState([]);
  const alert = useAlert();

  function handleChange(e) {
    setUserInfo({...userInfo, [e.target.name]:e.target.value});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(submitRequest())
    await axiosInstanceUnauth.post('/auth/jwt/create/', userInfo)
      .then((response) => {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        axiosInstance.defaults.headers['Authorization'] = `JWT ${response.data.access}`
        dispatch(loginSuccess(response.data));
        alert.success('Logged in successfully');
      })
      .catch((error) => {
        dispatch(loginFail(error.response.data))
        setValidators(error.response.data)
      })
  }

  useEffect(() => {
    return () => {
      dispatch(cleanSubmit());
    }
  })

  return (
    <React.Fragment>
      <main className='auth flex'>
        <h1 className='brand-big'>ScheduleIt!</h1>
        <Form 
          onSubmit={handleSubmit} 
          validators={validators}  
          onChange={handleChange}
        >
            <Input name="username" type="text" placeholder="Username"/>
            <Input name="password" type="password" placeholder="Password"/>
            <Submit type="text" className='button' value="Log In"/>
        </Form>
        <div className="auth__links flex">
          <Link to="/register/" className="link">Don't have an account yet? Register here!</Link>
          <Link to="/reset/" className="link">Forgot password?</Link>
        </div>
      </main>
      <div className="auth-image flex">
        <AuthImage/>
      </div>
    </React.Fragment>
  )
}

export default LoginPage
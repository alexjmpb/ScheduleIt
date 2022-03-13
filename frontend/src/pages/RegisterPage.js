import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { ReactComponent as AuthImage2 } from '../svg/login-image2.svg'
import Form from '../components/Form'
import Input from '../components/Input'
import { registerSuccess, registerFail, registerRequest, cleanSubmit } from '../state/auth/authActions'
import { axiosInstanceUnauth } from '../axios'
import Submit from '../components/Submit'

const RegisterPage = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    password: '',
    re_password: ''
  })
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [validators, setValidators] = useState([]);

  function handleChange(e) {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {  
    e.preventDefault();
    dispatch(registerRequest())
    await axiosInstanceUnauth.post('/auth/users/', userInfo)
      .then((response) => {
        dispatch(registerSuccess());
        navigate('/login/');
      })
      .catch((error) => {
        dispatch(registerFail(error.response.data));
        setValidators(error.response.data);
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
        <Form onSubmit={e => handleSubmit(e)} validators={validators}>
          <Input name="username" placeholder="Username" onChange={handleChange} validators={validators}/>
          <Input name="email" placeholder="Email" type="email" onChange={handleChange} validators={validators}/>
          <Input name="password" placeholder="Password" type="password" onChange={handleChange} validators={validators}/>
          <Input name="re_password" placeholder="Repeat Password" type="password" onChange={handleChange} validators={validators}/>
          <Submit className='button' value="Sign In"/>
        </Form>
        <div className="auth__links flex">
          <Link to="/login/" className="link">Already have an account? Login here!</Link>
        </div>
      </main>
      <div className="auth-image flex">
        <AuthImage2/>
      </div>
    </React.Fragment>
  )
}

export default RegisterPage
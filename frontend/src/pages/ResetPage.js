import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import BackButton from '../components/BackButton'
import Form from '../components/Form'
import Input from '../components/Input'
import Submit from '../components/Submit'
import { axiosInstanceUnauth } from '../axios'
import { submitRequest, cleanSubmit } from '../state/auth/authActions'
import { ReactComponent as AuthImage } from '../svg/login-image4.svg'
import { useAlert } from 'react-alert'

const ResetPage = () => {
  const [validators, setValidators] = useState([]);
  const [email, setEmail] = useState({
    email: ''
  })
  const dispatch = useDispatch();

  function handleChange(e) {
    setEmail({...email, [e.target.name]:e.target.value});
  }
  const alert = useAlert();

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(submitRequest())
    await axiosInstanceUnauth.post('/auth/users/reset_password/', email)
      .then((response) => {
        alert.success('Email sent successfully')
        setValidators([])
        dispatch(cleanSubmit());
      })
      .catch((error) => {
        if (error.response.data['email']) setValidators(error.response.data)
        else if (error.response.status === 429) setValidators({detail: "Maximum number of attemps reached. Please try again later"})
        else setValidators({detail: "Invalid email or not found"})
      })
  }

  useEffect(() => {
    return () => {
      dispatch(cleanSubmit());
    }
  })

  return (
    <React.Fragment>
      <div className='auth flex'>
        <BackButton/>
        <h1 className='brand-big'>ScheduleIt!</h1>
        <p>Enter your email to receive the reset link.</p>
        <Form 
          validators={validators} 
          onSubmit={handleSubmit} 
          onChange={handleChange}
        >
          <Input name="email" placeholder="Email"/>
          <Submit className="button" value="Send Email"/>
        </Form>
      </div>
      <div className="auth-image flex">
        <AuthImage/>
      </div>
    </React.Fragment>
  )
}

export default ResetPage
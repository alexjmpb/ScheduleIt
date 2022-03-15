import React, { useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axios'
import BackButton from '../components/BackButton'
import Form from '../components/Form'
import Input from '../components/Input'
import Submit from '../components/Submit'
import { cleanSubmit, submitRequest } from '../state/auth/authActions'

const ChangePasswordPage = () => {
  const [validators, setValidators] = useState([]);
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    re_new_password: ''
  });
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  function handleChange(e) {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    })
  }

  function handleSubmit(e) {
    e.preventDefault();

    dispatch(submitRequest());
    axiosInstance.post('/auth/users/set_password/', passwords)
      .then((Response) => {
        dispatch(cleanSubmit());
        alert.success('Password changed successfully')
        navigate('/profile/');
      })
      .catch((error) => {
        setValidators(error.response.data);
        dispatch(cleanSubmit());
      })
  }

  return (
    <main className='page'>
      <div className="component">
        <div className="component__header">
          <BackButton/>
          <h1 className="component__title">
            Change Password
          </h1>
        </div>
        <div className="component__body">
          <Form validators={validators} onSubmit={handleSubmit} onChange={handleChange}>
            <Input type="password" name="current_password" placeholder="Current password" validators={validators}/>
            <Input type="password" name="new_password" placeholder="New password" validators={validators}/>
            <Input type="password" name="re_new_password" placeholder="Repeat new password" validators={validators}/>
            <Submit className="button" value="Change Password"/>
          </Form>
        </div>
      </div>
    </main>
  )
}

export default ChangePasswordPage
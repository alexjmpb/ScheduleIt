import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom';
import { axiosInstanceUnauth } from '../axios';
import ModalBox, {ModalBody, ModalHeader} from '../components/modals/ModalBox'
import ProfilePage from './LoginPage';
import Form from '../components/Form';
import Input from '../components/Input';
import Submit from '../components/Submit';
import { ReactComponent as AuthImage } from '../svg/login-image5.svg'

const ResetConfirmPage = () => {
  const params = useParams();
  const [newPasswords, setNewPasswords] = useState({
    new_password: '',
    re_new_password: ''
  })
  const [validators, setValidators] = useState([])

  const navigate = useNavigate();

  function handleChange(e) {
    setNewPasswords({
      ...newPasswords,
      [e.target.name]: e.target.value
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    axiosInstanceUnauth.post('/auth/users/reset_password_confirm/', {
      ...newPasswords,
      uid: params.uid,
      token: params.token,
    })
    .then((response) => {
      navigate('/login/')
    })
    .catch((error) => {
      if (!error.response.data['new_password'] && !error.response.data['non_field_errors']) setValidators({...validators, detail: "Token or user is not valid."})
      else setValidators(error.response.data);
    })
  }

  return (
    <React.Fragment>
      <div className="auth flex">
        <h1 className='brand-big'>ScheduleIt!</h1>
        <p>Type your new password</p>
        <Form validators={validators} onSubmit={handleSubmit}>
          <Input validators={validators} name="new_password" placeholder="New password" type="password" onChange={handleChange}/>
          <Input validators={validators} name="re_new_password" placeholder="Repeat new password" type="password" onChange={handleChange}/>
          <Submit value="Reset Password" className="button"/>
        </Form>
        <div className="auth-links">
          <Link to="/login/" className='link'>Go to the login page</Link>
        </div>
      </div>
      <div className="auth-image flex">
        <AuthImage/>
      </div>
    </React.Fragment>
    
  )
}

export default ResetConfirmPage
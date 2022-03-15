import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BackButton from './BackButton';
import { ReactComponent as EditIcon } from '../svg/edit-icon.svg'
import { ReactComponent as CloseIcon } from '../svg/close-icon.svg'
import Form from './Form';
import Input from './Input';
import Submit from './Submit';
import { axiosInstance } from '../axios';
import { cleanSubmit, getUser, submitRequest } from '../state/auth/authActions';
import { useAlert } from 'react-alert';
import { Link, Navigate, useNavigate } from 'react-router-dom'
import ModalBox, { ModalBody, ModalFooter, ModalHeader } from './modals/ModalBox';
import ModalButton from './modals/ModalButton'
import LoadingProfile from './loading/LoadingProfile';
 
const Profile = ({ onClick }) => {
  const user = useSelector(state => state.auth.user);
  const userLoading = useSelector(state => state.auth.user_loading);
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [validators, setValidators] = useState([]);
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: ''
  })

  const [deleteValidators, setDeleteValidators] = useState([]);
  const [deletePassword, setDeletePassword] = useState({
    current_password: ''
  })
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleDeleteClose(e) {
    setDeleteOpen(false);
  }

  useEffect(() => {
    setUserInfo({
      username: user?.username,
      email: user?.email
    })
  }, [user])

  function handleChange(e) {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    })
  }

  function handleSubmit(e) {
    e.preventDefault();

    dispatch(submitRequest())
    axiosInstance.patch('/auth/users/me/', userInfo)
      .then((response) => {
        alert.success('Information updated successfully')
        setValidators([])
        dispatch(getUser())
        dispatch(cleanSubmit())
        setEditing(false)
      })
      .catch((error) => {
        dispatch(cleanSubmit())
        setValidators(error.response.data)
      })
  }

  function handleDeleteChange(e) {
    setDeletePassword({
      ...deletePassword,
      [e.target.name]: e.target.value
    })
  }

  function handleDelete(e) {
    e.preventDefault();

    dispatch(submitRequest());
    axiosInstance.delete('/auth/users/me/', {data: {current_password: deletePassword.current_password}})
      .then((response) => {
        dispatch(cleanSubmit());
        alert.show('User deleted.');
        navigate('/login/');
      })
      .catch((error) => {
        dispatch(cleanSubmit());
        setDeleteValidators(error.response.data);
      })
  }

  return (
    <div className="component">
      <div className="component__header">
        <BackButton/>
        <h1 className="component__title">
          Profile
        </h1>
      </div>
      {
        !userLoading ?
        <React.Fragment>
          <div className="component__body">
            <div className="profile">
              {
                !editing
                ?
                  <React.Fragment>
                    <img src={user?.image} className="profile__image image image-round image-xl"/>
                    <h1 className="profile__username">{user?.username}</h1>
                    <p className="profile__email">{user?.email}</p>
                    <EditIcon onClick={() => setEditing(true)} className="profile__edit"/>
                  </React.Fragment>
                :
                <React.Fragment>
                  <Form
                    validators={validators} 
                    onSubmit={handleSubmit} 
                    onChange={handleChange}
                  >
                    <img src={user?.image} className="profile__image image image-round image-xl"/>
                    <Input placeholder="Username" value={userInfo?.username} name="username"/>
                    <Input placeholder="Email" type="email" value={userInfo?.email} name="email"/>
                    <Submit value="Update" className="button"/>
                  </Form>
                  <CloseIcon onClick={() => setEditing(false)} className="profile__edit"/>
                </React.Fragment>  
              }
            </div>
          </div>
          <div className="component__footer">
            <Link to="/change-password/" className="button link">Change Password</Link>
            <button className='button button-red' onClick={e => setDeleteOpen(true)}>Delete User</button>
          </div>
          <ModalBox open={deleteOpen} handleClose={handleDeleteClose}>
              <ModalHeader>
                <h1>Delete User</h1>
              </ModalHeader>
              <ModalBody>
                Type your password to delete this user.
                <Form 
                  validators={deleteValidators} 
                  onChange={handleDeleteChange} 
                  onSubmit={handleDelete}
                >
                  <Input type="password" name="current_password" placeholder="Current Password"/>
                  <Submit value="Delete" className="button button-red"/>
                </Form>
              </ModalBody>
          </ModalBox>
        </React.Fragment>
        :
        <LoadingProfile/>
      }
    </div>
  )
}

export default Profile
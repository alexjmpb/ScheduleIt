import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { auth } from '../state/auth/authActions'

const HomePage = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(auth())
  }, [])
  
  const isAuth = useSelector(state => state.authReducer.isAuth)
  console.log(isAuth)
  return (
    <div>HomePage</div>
  )
}

export default HomePage;

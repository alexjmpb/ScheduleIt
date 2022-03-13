import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom';
import { auth, getUser } from '../state/auth/authActions';
import Header from '../components/Header'

const Layout = () => {
	const isAuth = useSelector(state => state.auth.isAuth);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(auth());
		dispatch(getUser());
	}, [])

	useEffect(() => {
		if (isAuth === false) navigate('login');
	}, [isAuth])

  return (
		<React.Fragment>
			<Header/>
			<Outlet/>
		</React.Fragment>
  )
}

export default Layout
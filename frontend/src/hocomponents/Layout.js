import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom';
import { auth, getUser } from '../state/auth/authActions';
import Header from '../components/Header'
import { useAlert } from 'react-alert';
import { darkTheme, lightTheme } from '../utils/themes';
import CreateTaskIcon from '../components/tasks/CreateTaskIcon';

const Layout = () => {
	const isAuth = useSelector(state => state.auth.isAuth);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const alert = useAlert();
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
		dispatch(auth());
		dispatch(getUser());
	}, [dark])

	useEffect(() => {
		if (isAuth === false) {
			alert.error('Authentication failed')
			navigate('login')
		};
	}, [isAuth])

  return (
		<React.Fragment>
			<Header/>
			<CreateTaskIcon/>
			<Outlet/>
		</React.Fragment>
  )
}

export default Layout
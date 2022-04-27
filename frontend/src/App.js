import './App.css';
import { Provider, useSelector } from 'react-redux'
import store from './state/store';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage';
import Layout from './hocomponents/Layout';
import LoginPage from './pages/LoginPage';
import AuthLayout from './hocomponents/AuthLayout';
import LogoutPage from './pages/LogoutPage';
import RegisterPage from './pages/RegisterPage';
import ResetPage from './pages/ResetPage';
import ResetConfirmPage from './pages/ResetConfirmPage';
import { positions, Provider as AlertProvider } from 'react-alert'
import { ReactComponent as SuccessIcon } from './svg/success-icon.svg'
import { ReactComponent as AlertIcon } from './svg/alert-icon.svg'
import { ReactComponent as ErrorIcon } from './svg/error-icon.svg'
import { ReactComponent as CloseIcon } from './svg/close-icon.svg'
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import CalendarPage from './pages/CalendarPage';
import SingleTaskPage from './pages/SingleTaskPage';
import CreateTaskPage from './pages/CreateTaskPage';
import moment from 'moment';

function App() {
  const options = {
    timeout: 2000,
    position: positions.TOP_CENTER
  }

  const AlertTemplate = ({ style, options, message, close }) => (
    <div style={style} className={"flex alert " + (options.type === 'error' ? 'alert--error' : options.type === 'success' ? 'alert--success' : '')}>
      {options.type === 'info' && <AlertIcon className="alert__icon"/>}
      {options.type === 'success' && <SuccessIcon className="alert__icon"/>}
      {options.type === 'error' && <ErrorIcon className="alert__icon"/>}
      <p className="alert__message">{message}</p>
      <button onClick={close}>{<CloseIcon  className="alert__close"/>}</button>
    </div>
  )


  return (
    <Provider store={store}>
      <AlertProvider
        template={AlertTemplate}
        {...options}
      >
        <div className='App'>
            <Router>
              <Routes>
                <Route path="/" element={<Layout/>}>
                  <Route index element={<HomePage/>}/>
                  <Route path='/logout/' element={<LogoutPage/>}/>
                  <Route path='/profile/' element={<ProfilePage/>}/>
                  <Route path='/change-password/' element={<ChangePasswordPage/>}/>
                  <Route path='/calendar/:year/' element={<Navigate to={`/calendar/${moment().format('YYYY')}/${moment().format('MM')}/`}/>}/>
                  <Route path='/calendar/' element={<Navigate to={`/calendar/${moment().format('YYYY')}/${moment().format('MM')}/`}/>}/>
                  <Route path='/calendar/:year/:month/' element={<CalendarPage/>}/>
                  <Route path='/calendar/edit/:element/' element={<SingleTaskPage/>}/>
                  <Route path='/calendar/create/' element={<CreateTaskPage/>}/>
                  <Route path='*' element={<main className='page'>Not found</main>}/>
                </Route>
                <Route path="/" element={<AuthLayout/>}>
                  <Route path="/login/" element={<LoginPage/>}/>
                  <Route path="/register/" element={<RegisterPage/>}/>
                  <Route path="/reset/" element={<ResetPage/>}/>
                  <Route path="/reset/confirm/:uid/:token/" element={<ResetConfirmPage/>}/>
                </Route>
              </Routes>
            </Router>
        </div>
      </AlertProvider>
    </Provider>
  );
}

export default App;

import './App.css';
import { Provider } from 'react-redux'
import store from './state/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import Layout from './hocomponents/Layout';
import LoginPage from './pages/LoginPage';
import AuthLayout from './hocomponents/AuthLayout';
import LogoutPage from './pages/LogoutPage';
import RegisterPage from './pages/RegisterPage';
import ResetPage from './pages/ResetPage';
import ResetConfirmPage from './pages/ResetConfirmPage';

function App() {
  return (
    <Provider store={store}>
      <div className='App'>
          <Router>
            <Routes>
              <Route path="/" element={<Layout/>}>
                <Route index element={<HomePage/>}/>
                <Route path='/logout/' element={<LogoutPage/>}/>
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
    </Provider>
  );
}

export default App;

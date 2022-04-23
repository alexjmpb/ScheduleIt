import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { ReactComponent as Logo } from '../svg/scheduleit-logo.svg'
import { ReactComponent as Menu } from '../svg/menu-icon.svg'
import LoadingNavAuth from './loading/LoadingNavAuth'
import moment from 'moment'

const Header = ({ onClick }) => {
  const user = useSelector(state => state.auth.user)
  const userLoading = useSelector(state => state.auth.user_loading)
  const currentPath = useLocation().pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const routeMatch = (route) => {
    return (currentPath === route ? true : false)
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [currentPath])

  return (
    <header className='header flex'>
      <div className="header__brand ">
        <Link to="/" className='link flex'>
          <Logo className="logo"/>
          <h1 className='brand'>ScheduleIt!</h1>
        </Link>
      </div>
      <Menu className="header__menu" onClick={e => setMenuOpen(!menuOpen)}/>
      <nav className={'nav flex ' + (menuOpen ? 'nav--active' : '')}>
        <ul className="nav__links">
          <li>
            <Link to="/"  className={'nav__link ' + (routeMatch('/') ? 'nav__link--active' : '')}>
              <h1>Home</h1>
            </Link>
          </li>
          <li>
            <Link to={currentPath.includes('calendar') && !currentPath.includes('edit') && !currentPath.includes('create') ? currentPath : `/calendar/${moment().format('YYYY/MM/')}`}  className={'nav__link ' + (currentPath.includes('calendar') ? 'nav__link--active' : '')}>
              <h1>Calendar</h1>
            </Link>
          </li>
        </ul>
        <div className='nav__auth flex'>
          {
            !userLoading ?
            <React.Fragment>
              <Link to="/profile/" className="nav__user link flex">
              <img src={user?.image} alt="" className='image image-round image-medium'/>
              </Link>
              <Link to="/profile/" className="nav__user link flex">
                <h2>{user?.username}</h2>
              </Link>
              <Link to='/logout/' className='link button'>Log Out</Link>
            </React.Fragment>
            :
            <LoadingNavAuth/>
          }
        </div>
      </nav>
      
    </header>
  )
}

export default Header
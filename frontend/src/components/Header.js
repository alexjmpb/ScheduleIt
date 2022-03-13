import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Header = () => {
  const user = useSelector(state => state.auth.user)

  return (
    <div>
      <div>Header</div>
      <div>{user?.username}</div>
      <Link to='/logout/'>Log Out</Link>
    </div>
  )
}

export default Header
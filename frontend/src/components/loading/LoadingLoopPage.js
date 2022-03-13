import React from 'react'
import LoadingLoop from './LoadingLoop'

const LoadingLoopPage = ({title}) => {
  return (
    <div className='fullpage'>
        <h1 className="page-title">{title}</h1>
        <LoadingLoop/>
    </div>
  )
}

export default LoadingLoopPage
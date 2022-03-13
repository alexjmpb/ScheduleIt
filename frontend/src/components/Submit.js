import React from 'react'
import { useSelector } from 'react-redux'
import LoadingLoop from './loading/LoadingLoop';

const Submit = (props) => {
  const submitLoading = useSelector(state => state.auth.submitLoading);
  return (
    <button {...props} type="submit" disabled={submitLoading ? true : false}>{submitLoading ? <LoadingLoop/> : props.value}</button>
  )
}

export default Submit
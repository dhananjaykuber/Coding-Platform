import React, { useEffect } from 'react';
import { setCountdownToNull } from '../redux/countdownSlice';
import { useDispatch } from 'react-redux';

const Error = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCountdownToNull());
  }, []);

  return <div>Error</div>;
};

export default Error;

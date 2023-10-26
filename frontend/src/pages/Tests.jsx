import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getAPIData from '../hooks/getAPIData';
import { useNavigate } from 'react-router-dom';
import Test from '../components/Test';
import { setCountdownToNull } from '../redux/countdownSlice';

const Tests = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user } = useSelector((store) => store.user);

  const [tests, setTests] = useState(null);

  const { data, getLoading, getError } = getAPIData(
    `${import.meta.env.VITE_NODE_API}/test`,
    {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }
  );

  useEffect(() => {
    dispatch(setCountdownToNull());

    if (!user) {
      navigate('/');
    }

    if (!getLoading && !getError) {
      console.log(data);
      setTests(data);
    }
  }, [data, getLoading, getError]);

  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">All Tests</h3>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {getLoading ? (
          <p>Loading...</p>
        ) : tests?.length <= 0 ? (
          <p className="text-red-600">No tests found</p>
        ) : (
          tests && tests.map((test) => <Test key={test._id} test={test} />)
        )}
      </div>
    </div>
  );
};

export default Tests;

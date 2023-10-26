import React, { useEffect, useState } from 'react';
import CreateTest from '../../components/admin/CreateTest';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import getAPIData from '../../hooks/getAPIData';
import { setTests } from '../../redux/adminSlice';
import Test from '../../components/admin/Test';
import { useNavigate } from 'react-router-dom';

const AllTests = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { tests } = useSelector((store) => store.admin);
  const { user } = useSelector((store) => store.user);

  const [createTest, setCreateTest] = useState(false);

  const { data, getLoading, getError } = getAPIData(
    `${import.meta.env.VITE_NODE_API}/admin/test`,
    {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }
  );

  useEffect(() => {
    if (!user) {
      navigate('/');
    }

    if (user.type !== 'admin' && user.type !== 'superadmin') {
      navigate('/');
    }

    if (!getLoading && !getError) {
      dispatch(setTests(data));
    }
  }, [data, getLoading, getError]);

  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">All Tests</h3>
        {createTest && (
          <CreateTest createTest={createTest} setCreateTest={setCreateTest} />
        )}
        <Button
          value={'Create Test'}
          className={'w-fit px-3 bg-green-600'}
          onClick={() => setCreateTest(true)}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {tests?.length > 0 &&
          tests.map((test) => <Test key={test._id} test={test} />)}
      </div>
    </div>
  );
};

export default AllTests;

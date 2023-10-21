import React, { useState } from 'react';
import Button from '../Button';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { error, success } from '../../utils/toasts';
import { updateTestStatus } from '../../redux/adminSlice';
import { Link } from 'react-router-dom';

const Test = ({ test }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);

  const [loading, setLoading] = useState(false);

  const handleChangeStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_NODE_API}/admin/test/${test._id}`,
        { isLive: !test.isLive },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(updateTestStatus({ id: test._id, isLive: !test.isLive }));
      success(`${test.title} is ${test.isLive ? 'not live' : 'live'} now.`);
    } catch (err) {
      error(err.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md p-4 w-[30%]">
      <h5 className="text-lg font-semibold mb-2">{test.title}</h5>
      <p className="text-sm mb-1">{test.description}</p>
      <p className="text-sm mb-1">&#x1F550; {test.time}</p>
      <p className="text-sm mb-5">
        Live:{' '}
        <span className="cursor-pointer">{test.isLive ? '✅' : '❌'} </span>
        <Button
          value={'Change Status'}
          className={'w-fit p-2 ml-2 text-xs'}
          onClick={handleChangeStatus}
          loading={loading}
        />
      </p>

      <Link
        to={`/admin/${test._id}`}
        className={'w-fit p-2 px-3 text-xs bg-green-600 text-white rounded-md'}
      >
        Manage Test
      </Link>
    </div>
  );
};

export default Test;

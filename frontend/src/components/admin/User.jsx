import React, { useState } from 'react';
import Button from '../Button';
import Input from '../Input';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { success, error } from '../../utils/toasts';
import { updateUser } from '../../redux/adminSlice';
import { useParams } from 'react-router-dom';

const User = ({ item, index }) => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);

  const [password, setPassword] = useState('');

  const [edit, setEdit] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const handleEditPassword = async () => {
    setLoadingEdit(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_NODE_API}/admin/update-password`,
        {
          id: item._id,
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      success(res.data.message);
      setEdit(false);
      setPassword('');
    } catch (err) {
      error(err.response.data.error);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleResetTest = async () => {
    setLoadingReset(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_NODE_API}/admin/reset-test`,
        {
          userId: item._id,
          testId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(updateUser({ id: item._id, submitted: false }));
      success(res.data.message);
    } catch (err) {
      error(err.response.data.error);
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <tr>
      <td className="border border-gray-300 p-2">{index + 1}</td>
      <td className="border border-gray-300 p-2">{item.email}</td>
      <td className="border border-gray-300 p-2">
        {item.submitted ? '✅' : '❌'}
      </td>
      <td className="border border-gray-300 p-2">
        {edit ? (
          <div className="flex items-center gap-2 justify-center">
            <Input
              className={'border p-1 m-0 w-[150px]'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              value={'Edit'}
              onClick={handleEditPassword}
              loading={loadingEdit}
              className={'w-fit bg-green-700 px-3 text-white text-xs'}
            />
          </div>
        ) : (
          <Button
            value={'Edit'}
            onClick={() => setEdit(true)}
            className={'w-fit bg-green-700 px-3 text-white text-xs'}
          />
        )}
      </td>
      <td className="border border-gray-300 p-2">
        <Button
          value={'Reset'}
          onClick={handleResetTest}
          loading={loadingReset}
          className={'w-fit bg-red-700 px-3 text-white text-xs'}
        />
      </td>
    </tr>
  );
};

export default User;

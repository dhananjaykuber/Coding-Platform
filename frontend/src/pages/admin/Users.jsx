import React, { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import getAPIData from '../../hooks/getAPIData';
import { useDispatch, useSelector } from 'react-redux';
import User from '../../components/admin/User';
import { setAllUsers } from '../../redux/adminSlice';
import { useParams } from 'react-router-dom';

const Users = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);
  const { allUsers } = useSelector((store) => store.admin);

  const { data, getLoading, getError } = getAPIData(
    `${import.meta.env.VITE_NODE_API}/admin/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }
  );

  useEffect(() => {
    if (!getLoading && !getError) {
      dispatch(setAllUsers(data));
    }
  }, [data, getLoading, getError]);

  return (
    <div>
      <Sidebar>
        {getLoading ? (
          <p>Loading...</p>
        ) : allUsers?.length <= 0 ? (
          <p className="text-red-600">
            No participants have taken the test so far.
          </p>
        ) : (
          <div>
            <table className="table-fixed border-collapse border border-slate-300 ">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 font-semibold">
                    No.
                  </th>
                  <th className="border border-gray-300 p-2 font-semibold">
                    Email
                  </th>
                  <th className="border border-gray-300 p-2 font-semibold">
                    Submitted
                  </th>
                  <th className="border border-gray-300 p-2 font-semibold">
                    Edit Password
                  </th>
                  <th className="border border-gray-300 p-2 font-semibold">
                    Reset Test
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUsers?.map((item, index) => (
                  <User item={item} key={item._id} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Sidebar>
    </div>
  );
};

export default Users;

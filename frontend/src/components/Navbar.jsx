import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import { setUser } from '../redux/userSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);

  return (
    <div className="flex items-center justify-between border-b p-4">
      <div>
        <Link to={'/'} className="text-2xl font-bold">
          Coding Platform
        </Link>
      </div>

      {user ? (
        <div className="flex items-center justify-center">
          <Button
            value={'Logout'}
            className={'w-fit px-5 mr-5'}
            onClick={() => {
              localStorage.setItem('user', null);
              dispatch(setUser(null));
              navigate('/login');
            }}
          />
          <div className="text-2xl font-semibold">&#x1F550; 30:00</div>
        </div>
      ) : (
        <div>
          <Link
            to="/login"
            className="bg-gray-800 text-gray-200 p-2 rounded-md px-5 ml-4"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-gray-800 text-gray-200 p-2 rounded-md px-5 ml-4"
          >
            Signup
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;

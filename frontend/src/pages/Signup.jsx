import React, { useEffect, useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import postAPIData from '../hooks/postAPIData';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error, sendData } = postAPIData();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  const handleSignup = async () => {
    const data = await sendData(
      `${import.meta.env.VITE_NODE_API}/auth/signup`,
      null,
      {
        email,
        password,
      }
    );

    if (data) {
      localStorage.setItem('user', JSON.stringify(data));
      dispatch(setUser(data));
    }
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-[90vh]">
      <form>
        <h1 className="font-bold text-3xl mb-3 ">Signup</h1>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={'Email'}
          type="email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={'Password'}
          type="password"
        />
        <Button value={'Signup'} onClick={handleSignup} loading={loading} />

        <p className="text-sm mt-3 text-center">
          Already have an account?{' '}
          <Link to={'/login'} className="text-blue-600 underline">
            {' '}
            Click here.
          </Link>
        </p>

        {error && (
          <p className="text-sm mt-3 text-red-600 text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default Signup;

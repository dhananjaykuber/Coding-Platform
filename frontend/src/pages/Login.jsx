import React, { useEffect, useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import postAPIData from '../hooks/postAPIData';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error, sendData } = postAPIData();

  useEffect(() => {
    if (user) {
      navigate('/question');
    }
  }, [user]);

  const handleLogin = async () => {
    const data = await sendData(
      `${import.meta.env.VITE_NODE_API}/auth/login`,
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
        <h1 className="font-bold text-3xl mb-3 ">Login</h1>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <Button value={'Login'} onClick={handleLogin} loading={loading} />

        <p className="text-sm mt-3 text-center">
          Don't have an account?{' '}
          <Link to={'/signup'} className="text-blue-600 underline">
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

export default Login;

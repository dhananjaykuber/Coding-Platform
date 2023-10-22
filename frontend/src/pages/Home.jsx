import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCountdownToNull } from '../redux/countdownSlice';

const Home = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);

  useEffect(() => {
    dispatch(setCountdownToNull());
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[80vh] flex-col">
      <h1 className="text-3xl font-bold">Coding Platform</h1>
      <p className="w-[70%] text-center mt-5">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad,
        voluptatibus! Accusamus mollitia itaque deleniti vero exercitationem hic
        qui cupiditate aut deserunt. Accusamus voluptates veritatis ad, fugit
        natus voluptatem, officiis ducimus vel ea hic quos nisi ipsam culpa vero
        beatae veniam!
      </p>
      {user ? (
        <Link
          to="/test"
          className="bg-green-800 text-white p-2 rounded-md px-5 mt-5 w-fit"
        >
          View Tests
        </Link>
      ) : (
        <Link
          to="/signup"
          className="bg-gray-800 text-gray-200 p-2 rounded-md px-5 mt-5"
        >
          Signup here
        </Link>
      )}
    </div>
  );
};

export default Home;

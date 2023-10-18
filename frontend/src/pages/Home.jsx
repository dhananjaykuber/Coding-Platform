import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useSelector } from 'react-redux';

const Home = () => {
  const { user } = useSelector((store) => store.user);

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
      {!user && (
        <Link
          to="/signup"
          className="bg-gray-800 text-gray-200 p-2 rounded-md px-5 mt-5"
        >
          Signup here
        </Link>
      )}
      {user && user.submitted === false && (
        <Link
          onClick={() => localStorage.setItem('startTest', true)}
          to="/question"
          className="bg-green-800 text-white p-2 rounded-md px-5 mt-5 w-fit"
        >
          Start Test
        </Link>
      )}
      {user && user.submitted === true && (
        <div className="mt-10 flex items-center justify-center">
          <p className="text-red-600 font-semibold text-xl">
            You have already submitted the test.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;

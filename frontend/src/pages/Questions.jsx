import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getAPIData from '../hooks/getAPIData';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import axios from 'axios';
import { countdown } from '../components/Countdown';
import { setUser } from '../redux/userSlice';

const Questions = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);

  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data, getLoading, getError } = getAPIData(
    `${import.meta.env.VITE_NODE_API}/question`,
    {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }
  );

  useEffect(() => {
    if (!user) {
      navigate('/signup');
    }

    if (!getLoading && !getError) {
      console.log(data);
      setQuestions(data);
    }
  }, [data, getLoading, getError]);

  const handleEndTest = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_NODE_API}/code/end`,
        {
          endedAt: document.getElementById('time').innerText,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      clearInterval(countdown);
      localStorage.setItem('minutes', 0);
      localStorage.setItem('seconds', 0);

      dispatch(setUser({ ...user, submitted: true }));
      localStorage.setItem(
        'user',
        JSON.stringify({ ...user, submitted: true })
      );

      navigate('/');
    } catch (error) {
      console.log(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  if (getError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-red-600 font-semibold text-sm">{getError}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center flex-col">
      {getLoading ? (
        <p className="text-sm">Loading...</p>
      ) : (
        <div>
          <div className="flex border-b pb-4 mb-4">
            <div className="px-5 w-[100px] font-bold text-xl">No.</div>
            <div className="px-5 w-[500px] font-bold text-xl">Title</div>
            <div className="px-5 w-[100px] font-bold text-xl">Status</div>
          </div>
          {questions?.map((question) => (
            <div className="flex mb-5 border-b pb-4" key={question._id}>
              <div className="px-5 w-[100px]">{question.number}</div>
              <div className="px-5 w-[500px]">{question.description}</div>
              <div className="px-5 w-[100px]">
                {question.submitted ? (
                  <Link
                    to={`/question`}
                    className="bg-red-500 text-white text-sm p-2 rounded-md"
                  >
                    Solved
                  </Link>
                ) : (
                  <Link
                    to={`/question/${question._id}`}
                    className="bg-green-700 text-white text-sm p-2 rounded-md"
                  >
                    Solve
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <Button
        value={'End Test'}
        className="bg-red-700 text-white text-sm p-2 px-5 rounded-md w-fit mt-12"
        onClick={handleEndTest}
        loading={loading}
      />
    </div>
  );
};

export default Questions;

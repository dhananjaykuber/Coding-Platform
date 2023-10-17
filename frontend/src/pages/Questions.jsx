import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import getAPIData from '../hooks/getAPIData';
import { Link, useNavigate } from 'react-router-dom';

const Questions = () => {
  const navigate = useNavigate();

  const { user } = useSelector((store) => store.user);

  const [questions, setQuestions] = useState(null);

  const { data, loading, error } = getAPIData(
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

    if (!loading && !error) {
      setQuestions(data);
    }
  }, [data, loading, error]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      {loading ? (
        <p>Loading...</p>
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
    </div>
  );
};

export default Questions;

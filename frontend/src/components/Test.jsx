import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import postAPIData from '../hooks/postAPIData';
import Button from './Button';

const Test = ({ test }) => {
  const navigate = useNavigate();

  const { user } = useSelector((store) => store.user);

  const { loading, sendData } = postAPIData();

  const handleStartTest = async () => {
    const data = await sendData(
      `${import.meta.env.VITE_NODE_API}/test/start`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
      {
        testId: test._id,
      }
    );

    if (data) {
      navigate(`/test/${test._id}/questions`);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md p-4 w-[30%]">
      <h5 className="text-lg font-semibold mb-2">{test.title}</h5>
      <p className="text-sm mb-1">{test.description}</p>
      <p className="text-sm mb-1">
        &#x1F550;{' '}
        {`${
          test.time.split(':')[0] < 10
            ? '0' + test.time.split(':')[0]
            : test.time.split(':')[0]
        }:${
          test.time.split(':')[1] < 10
            ? '0' + test.time.split(':')[1]
            : test.time.split(':')[1]
        }`}
      </p>
      <p className="text-sm mb-5">
        Live:{' '}
        <span className="cursor-pointer">{test.isLive ? '✅' : '❌'} </span>
      </p>

      {test.isLive ? (
        test?.canResume ? (
          <Button
            className={
              'w-fit p-2 px-3 text-xs bg-blue-600 text-white rounded-md'
            }
            value={'Resume'}
            onClick={handleStartTest}
          />
        ) : test?.submitted ? (
          <Button
            className={
              'w-fit p-2 px-3 text-xs bg-red-700  text-white rounded-md'
            }
            value={'Already Given'}
          />
        ) : (
          <Button
            className={
              'w-fit p-2 px-3 text-xs bg-green-600 text-white rounded-md'
            }
            value={'Start'}
            onClick={handleStartTest}
            loading={loading}
          />
        )
      ) : (
        <Button
          className={'w-fit p-2 px-3 text-xs bg-red-700  text-white rounded-md'}
          value={'Not Live'}
        />
      )}
    </div>
  );
};

export default Test;

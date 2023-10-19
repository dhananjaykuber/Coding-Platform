import React, { useState, useEffect } from 'react';
import { error } from '../utils/toasts';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

export let countdown = null;

const Countdown = () => {
  const { user } = useSelector((store) => store.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const initialMinutes = parseInt(localStorage.getItem('minutes')) || 60;
  const initialSeconds = parseInt(localStorage.getItem('seconds')) || 0;

  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    countdown = setInterval(() => {
      if (minutes === 0 && seconds === 0) {
        clearInterval(countdown);
        endTest();
      } else if (
        (minutes === 0 && seconds === 5) ||
        (minutes === 0 && seconds === 10) ||
        (minutes === 0 && seconds === 30) ||
        (minutes === 1 && seconds === 0) ||
        (minutes === 2 && seconds === 0) ||
        (minutes === 5 && seconds === 0)
      ) {
        error(
          `0${minutes}:${seconds >= 10 ? seconds : '0' + seconds} ${
            minutes >= 1 ? 'minutes' : 'seconds'
          } remaing to end the test.`
        );
        if (seconds === 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
        localStorage.setItem('minutes', minutes.toString());
        localStorage.setItem('seconds', seconds.toString());
      } else {
        if (seconds === 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
        localStorage.setItem('minutes', minutes.toString());
        localStorage.setItem('seconds', seconds.toString());
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [minutes, seconds]);

  const endTest = async () => {
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
    }
  };

  return (
    <div
      className={twMerge(
        `text-2xl font-semibold w-[120px] rounded-md py-1 mr-4 flex items-center justify-center ${
          minutes < 1 && 'bg-red-700 text-white'
        }`
      )}
    >
      &#x1F550;
      <div id="time">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
    </div>
  );
};

export default Countdown;

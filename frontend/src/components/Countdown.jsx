import React, { useEffect } from 'react';
import { error } from '../utils/toasts';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setCountdownToNull,
  setSeconds,
  setTime,
} from '../redux/countdownSlice';

const Countdown = ({ testId }) => {
  const { user } = useSelector((store) => store.user);
  const { minutes, seconds } = useSelector((store) => store.countdown);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const updateRemaningTime = async () => {
    const localStorageTime = localStorage.getItem(testId);
    const { minutes, seconds } = JSON.parse(localStorageTime);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_NODE_API}/test/update-time/${testId}`,
        {
          time: `${minutes}:${seconds}`,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getRemaningTime = async () => {
    // check that test remaning time is present in localstorage
    const localStorageTime = localStorage.getItem(testId);

    // if not present then fetch it from server
    if (localStorageTime == null) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_NODE_API}/test/remaning-time/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        console.log('Remaining time: ', res.data);

        const [min, sec] = res.data.remaningTime.split(':');

        // get the time and set it to local storage
        localStorage.setItem(
          testId,
          JSON.stringify({
            minutes: min,
            seconds: sec,
          })
        );

        dispatch(setTime({ minutes: min, seconds: sec }));
      } catch (error) {
        console.log(error);
      }
    } else {
      const { minutes, seconds } = JSON.parse(localStorageTime);

      dispatch(setTime({ minutes, seconds }));
    }
  };

  useEffect(() => {
    getRemaningTime();
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (minutes == 0 && seconds == 0) {
        clearInterval(countdown);

        endTest();

        dispatch(setCountdownToNull());
      } else if (
        (minutes == 0 && seconds == 5) ||
        (minutes == 0 && seconds == 10) ||
        (minutes == 0 && seconds == 30) ||
        (minutes == 1 && seconds == 0) ||
        (minutes == 2 && seconds == 0) ||
        (minutes == 5 && seconds == 0)
      ) {
        error(
          `0${minutes}:${seconds >= 10 ? seconds : '0' + seconds} ${
            minutes >= 1 ? 'minutes' : 'seconds'
          } remaing to end the test.`
        );
        if (seconds == 0) {
          dispatch(setTime({ minutes: minutes - 1, seconds: 59 }));

          localStorage.setItem(
            testId,
            JSON.stringify({
              minutes: minutes - 1,
              seconds: 59,
            })
          );
        } else {
          dispatch(setSeconds(seconds - 1));

          localStorage.setItem(
            testId,
            JSON.stringify({
              minutes: minutes,
              seconds: seconds - 1,
            })
          );
        }
      } else {
        if (seconds == 0) {
          dispatch(setTime({ minutes: minutes - 1, seconds: 59 }));

          localStorage.setItem(
            testId,
            JSON.stringify({
              minutes: minutes - 1,
              seconds: 59,
            })
          );
        } else {
          dispatch(setSeconds(seconds - 1));

          localStorage.setItem(
            testId,
            JSON.stringify({
              minutes: minutes,
              seconds: seconds - 1,
            })
          );
        }
      }

      if (seconds % 10 == 0 || seconds == 0) {
        // after every 10 seconds make api call to update remaning time
        updateRemaningTime();
      }
    }, 1000);

    // clear intervals when unmounting Countdown component
    return () => clearInterval(countdown);
  }, [minutes, seconds]);

  const endTest = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_NODE_API}/test/end`,
        {
          endedAt: `${minutes}:${seconds}`,
          testId: testId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      localStorage.removeItem(testId);

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
        {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </div>
    </div>
  );
};

export default Countdown;

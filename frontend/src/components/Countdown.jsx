import React, { useState, useEffect } from 'react';

export let countdown = null;

const Countdown = () => {
  const initialMinutes = parseInt(localStorage.getItem('minutes')) || 30;
  const initialSeconds = parseInt(localStorage.getItem('seconds')) || 0;

  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    countdown = setInterval(() => {
      if (minutes === 0 && seconds === 0) {
        clearInterval(countdown);
        alert('Time is up!');
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

  return (
    <div className="text-2xl font-semibold w-[150px] flex">
      &#x1F550;
      <div id="time">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
    </div>
  );
};

export default Countdown;

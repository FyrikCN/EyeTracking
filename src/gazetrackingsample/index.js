// WebGazerPage.js
import React, { useEffect, useRef, useState } from 'react';
// import './WebGazerPage.css'; // 复制CSS内容或创建新的

function GazeTrackingSample() {
  const canvasRef = useRef(null);
  const [gazePoints, setGazePoints] = useState([]);
  const [gazeDirection, setGazeDirection] = useState('left')
  const [fetching, setFetching] = useState(false);
  const timerRef = useRef(null);

  const fetchGazePoints = async () => {
    try {
      const response = await fetch('http://localhost:5050/gaze');
      const data = await response.json();
      console.log('data', data);

      // if (data.x !== undefined && data.y !== undefined) {
      //   setGazePoints([data]);
      // } else {
      //   setGazePoints(data);
      // }
    } catch (error) {
      console.error('Error fetching gaze points:', error);
    }
  };

  const startFetching = () => {
    setFetching(true);
    timerRef.current = setInterval(fetchGazePoints, 500);
  };

  const stopFetching = async () => {
    setFetching(false);
    // const response = await fetch('http://localhost:5050/stopgaze');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopFetching();
    };
  }, []);

  useEffect(() => {
    if (fetching) {
      startFetching();
    } else {
      stopFetching();
    }
  }, [fetching]);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');

  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;

  //   const drawGazePoints = () => {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     if (gazePoints.length) {
  //       gazePoints.forEach((point) => {
  //         if (point.x !== undefined && point.y !== undefined) {
  //           ctx.beginPath();
  //           ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI, false);
  //           ctx.fillStyle = 'red';
  //           ctx.fill();
  //         }
  //         console.log(window.innerWidth, window.innerHeight, point);
  //       });
  //     }
  //   };

  //   drawGazePoints();
  // }, [gazePoints]);

  return (
    <div className="web-gazer-page">
      <button
        onClick={() => setFetching(!fetching)}
        className="fetch-button absolute z-10 border border-1px rounded-lg border-black px-2 m-2"
      >
        {fetching ? 'Stop Tracking' : 'Start Tracking'}
      </button>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default GazeTrackingSample;

import React, { useState, useEffect, useRef } from 'react';
import webgazer from 'webgazer';
import Calibration from '../webgazerusage/calibration';

const Rectangle = () => {
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentGazePoint, setCurrentGazePoint] = useState({ x: -1, y: -1 });
  const [gazePoints, setGazePoints] = useState([]);

  // Handle calibration completion callback
  const handleFinishCalibration = () => {
    setIsCalibrated(true);
  };

  useEffect(() => {
    console.log("initiating");

    // Add a delay to ensure WebGazer is fully loaded
    setTimeout(() => {
      webgazer.setRegression('ridge') // Set regression model
        .setGazeListener((data, timestamp) => {
          if (data) {
            // Record gaze point
            setCurrentGazePoint({ x: data.x, y: data.y });
          }
        })
        .begin();
    }, 1000); // Adjust delay as needed

    return () => {
      webgazer.end();
    };
  }, []);

  useEffect(() => {
    // Start listening for Enter key to toggle recording
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        toggleRecording();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      setGazePoints(prevPoints => [...prevPoints, currentGazePoint]);
    }
  }, [currentGazePoint]);

  useEffect(() => {
    if (!isRecording) {
      console.log(gazePoints);
      setGazePoints([]);
    }
  }, [isRecording]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const renderLines = () => {
    return gazePoints.map((point, index) => {
      if (index === 0) return null;
      const prevPoint = gazePoints[index - 1];

      return (
        <line
          key={index}
          x1={prevPoint.x}
          y1={prevPoint.y}
          x2={point.x}
          y2={point.y}
          stroke="red"
          strokeWidth="1"
        />
      );
    });
  };

  return (
    <>
      {!isCalibrated ? (
        // Show calibration steps
        <Calibration onFinishCalibration={handleFinishCalibration} webgazer={webgazer} />
      ) : (
        <>
          <div className="absolute top-[10%] left-[10%] w-4/5 h-4/5 border border-black bg-transparent"></div>
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500">
            Press Enter to {isRecording ? 'Stop' : 'Start'} recording
          </p>
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          >
            {renderLines()}
          </svg>
        </>
      )}
    </>
  );
};

export default Rectangle;

import React, { useEffect, useState } from 'react';
import webgazer from 'webgazer';
import ButtonGrid from '../buttonspage';

const WebGazerUsage = () => {
  const [gazeData, setGazeData] = useState({ x: 0, y: 0 });

  useEffect(() => {
    webgazer.setRegression('ridge')
      .setGazeListener((data) => {
        if (data) {
          setGazeData(data);
        }
      })
      .begin();

    return () => {
      webgazer.end();
    };
  }, []);

  const getButtonElements = () => {
    return document.querySelectorAll('.grid-button');
  };

  const checkGazeOnButton = () => {
    const buttons = getButtonElements();
    const { x, y } = gazeData;
    buttons.forEach((button) => {
      const rect = button.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        button.style.backgroundImage = 'linear-gradient(to right, #4f46e5, #a855f7, #ec4899)'; // Apply gradient when gazed at
      } else {
        button.style.backgroundImage = 'none'; // Reset to the original color
        button.style.backgroundColor = 'rgb(59, 130, 246)'; // Reset to the original blue color
      }
    });
  };

  useEffect(() => {
    checkGazeOnButton();
  }, [gazeData]);

  return (
    <div>
      <ButtonGrid />
    </div>
  );
};

export default WebGazerUsage;

import React, { useEffect, useState } from 'react';
import webgazer from 'webgazer';
import Calibration from './calibration';
import ButtonGrid from '../buttonspage';
import './index.css';

const WebGazerUsage = () => {
  const [gazeData, setGazeData] = useState({ x: 0, y: 0 });
  const [isCalibrated, setIsCalibrated] = useState(false);

  useEffect(() => {
    webgazer.setRegression('ridge')
      .setGazeListener((data) => {
        if (data) {
          setGazeData(data);
        }
      })
      // .begin();

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
        button.classList.add('bg-button-gazed');
      } else {
        button.classList.remove('bg-button-gazed');
      }
    });
  };

  const handleCalibrationFinish = () => {
    setIsCalibrated(true);
  };

  const handleReCalibration = () => {
    webgazer.end(); // 结束当前 WebGazer 实例
    webgazer.clearData()
    setIsCalibrated(false); // 重置校准状态
    setGazeData({ x: 0, y: 0 }); // 清除现有数据
  };

  useEffect(() => {
    checkGazeOnButton();
  }, [gazeData]);

  return (
    <div>
      {!isCalibrated ? (
        <Calibration onFinishCalibration={handleCalibrationFinish} webgazer={webgazer} />
      ) : (
        // 校准完成后加载主页面，并传递重校准的处理函数
        <ButtonGrid onReCalibration={handleReCalibration} />
      )}
    </div>
  );
};

export default WebGazerUsage;

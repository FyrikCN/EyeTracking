import React, { useState, useEffect } from 'react';
import Calibration from '../webgazerusage/calibration';
import webgazer from 'webgazer'; // 确保已安装并引入 webgazer 库
import List from './list';

const SERPCrossRef = () => {
  const [isCalibrated, setIsCalibrated] = useState(false);
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

  // 处理校准完成的回调
  const handleFinishCalibration = () => {
    setIsCalibrated(true);
  };

  return (
    <div>
      {!isCalibrated ? (
        // 显示校准步骤
        <Calibration onFinishCalibration={handleFinishCalibration} webgazer={webgazer} />
      ) : (
        // 校准完成后显示的页面
        // <div>
        //   <h1>Calibration Complete</h1>
        //   <p>Your eye tracking is now ready!</p>
        //   {/* 你可以在这里显示主应用页面 */}
        // </div>
        <List />
      )}
    </div>
  );
};

export default SERPCrossRef;

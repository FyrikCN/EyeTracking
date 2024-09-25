import React, { useState } from 'react';
import clsx from 'clsx';

const Calibration = ({ onFinishCalibration }) => {
  const calibrationTimes = 5
  const [isStarted, setIsStarted] = useState(false);
  const [clickCounts, setClickCounts] = useState(Array(9).fill(0));
  const [isFinished, setIsFinished] = useState(false); // 新增状态用于跟踪是否完成校准

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleButtonClick = (index) => {
    const newClickCounts = [...clickCounts];
    newClickCounts[index] += 1;
    setClickCounts(newClickCounts);

    if (newClickCounts.every(count => count >= calibrationTimes)) {
      setIsFinished(true); // 更新状态以指示完成校准
    }
  };

  // 按钮布局样式，定义每个点的相对位置
  const buttonPositions = [
    { top: '0', left: '0' },    // 左上角
    { top: '0', left: '50%', transform: 'translateX(-50%)' },  // 顶中
    { top: '0', right: '0' },   // 右上角
    { top: '50%', left: '0', transform: 'translateY(-50%)' },  // 左中
    { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, // 中间
    { top: '50%', right: '0', transform: 'translateY(-50%)' },  // 右中
    { bottom: '0', left: '0' }, // 左下角
    { bottom: '0', left: '50%', transform: 'translateX(-50%)' }, // 下中
    { bottom: '0', right: '0' } // 右下角
  ];

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-white p-4">
      {!isStarted ? (
        <>
          <span className='mb-2 text-lg'>Click on each calibration point for {calibrationTimes} times.</span>
          <span className='mb-6 text-lg'>When you are ready, click on the button below.</span>
          <button
            className="bg-indigo-600 text-white text-lg py-2 px-4 rounded-md hover:bg-indigo-800"
            onClick={handleStart}
          >
            Start Calibration
          </button>
        </>
      ) : isFinished ? ( // 显示 "Finish Calibration" 按钮
      <>
        <span className='mb-2 text-lg'>On the next page, you can clear all calibration data</span>
        <span className='mb-6 text-lg'>by moving your cursor to the top area of the screen and clicking on 'ReCalibration'.</span>
        <button
          className="bg-green-600 text-white text-lg py-2 px-4 rounded-md hover:bg-green-800"
          onClick={onFinishCalibration}
        >
          Finish Calibration
        </button></>
      ) : (
        <div className="relative w-full h-full">
          {Array(9).fill(0).map((_, index) => (
            <button
              key={index}
              className={clsx(
                "absolute w-6 h-6 rounded-full text-white text-lg flex items-center justify-center",
                clickCounts[index] >= calibrationTimes ? 'bg-green-500' : 'bg-indigo-600'
              )}
              style={buttonPositions[index]} // 根据预定义位置应用样式
              onClick={() => handleButtonClick(index)}
            >
              {clickCounts[index]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calibration;

import React, { useState } from 'react';

const ButtonGrid = ({ onReCalibration }) => {
  const [isHovered, setIsHovered] = useState(false); // 状态用于跟踪鼠标悬停

  return (
    <div>
      <div
        className="absolute top-0 left-1/2 translate-x-[-50%] flex justify-center items-center rounded-md"
        onMouseEnter={() => setIsHovered(true)} // 鼠标进入时更新状态
        onMouseLeave={() => setIsHovered(false)} // 鼠标离开时更新状态
      >
        <div className={`relative transition-transform duration-300 ${isHovered ? 'translate-y-0' : '-translate-y-10'}`}>
          {/* 背景渐变边框的容器 */}
          <div className={`p-[1px] rounded-md bg-gradient-to-r from-white to-pink-500`}>
            {/* ReCalibration按钮，初始时位置偏上，悬停时下滑 */}
            <div
              className={`bg-button-default p-1 text-white flex justify-center items-center rounded-md cursor-pointer relative z-10 transition-transform duration-300`}
              onClick={onReCalibration} // 点击按钮时触发重校准
            >
              ReCalibration
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 p-8 h-screen bg-blue-black">
        {[...Array(6)].map((_, index) => (
          <button
            key={index}
            className="grid-button w-[100%] h-[100%] rounded-2xl bg-button-default text-white border-none cursor-pointer transition-shadow duration-300 ease-in-out focus:outline-none shadow-lg hover:shadow-xl"
            style={{ flexGrow: 1 }} // Default blue color
          >
            Button {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonGrid;

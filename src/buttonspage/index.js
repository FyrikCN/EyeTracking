import React, { useState, useEffect } from 'react';

// 动态导入public/coins文件夹中的图片
const importAll = (r) => {
  try {
    const images = r.keys().map(r);
    const imageNames = r.keys().map(key => key.replace('./', '')); // 提取文件名
    return { images, imageNames };
  } catch (error) {
    console.error("Error importing images:", error);
    return { images: [], imageNames: [] }; // Return empty arrays in case of error
  }
};

const { images, imageNames } = importAll(require.context('../../public/coins', false, /\.(png|jpe?g|svg)$/));

const ButtonGrid = ({ onReCalibration, currentImages }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <div
        className="absolute top-0 left-1/2 translate-x-[-50%] flex justify-center items-center rounded-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative ${isHovered ? 'md:translate-y-0' : 'md:-translate-y-10'} md:transition-transform md:duration-300 mt-2 md:mt-0`}>
          <div className={`p-[1px] rounded-md bg-gradient-to-r from-white to-pink-500`}>
            <div
              className={`bg-button-default p-1 text-white flex justify-center items-center rounded-md cursor-pointer relative z-10 transition-transform duration-300`}
              onClick={onReCalibration}
            >
              ReCalibrate
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 mb:grid-cols-2 gap-4 p-8 h-screen bg-blue-black">
        {currentImages.map((index, gridIndex) => (
          <div
            key={gridIndex}
            className={`grid-button w-[100%] h-[100%] rounded-2xl p-1 bg-white text-white border-none cursor-pointer transition-shadow duration-300 ease-in-out focus:outline-none shadow-lg hover:shadow-xl flex items-center justify-center`}
            style={{ flexGrow: 1 }}
            data-image-name={imageNames[index]} // 将图片名称添加到data属性
          >
            {index < images.length ? (
              <img
                src={images[index]}
                alt={`coin-${gridIndex + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <img
                src={images[0]}
                alt={`coin-${0 + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonGrid;

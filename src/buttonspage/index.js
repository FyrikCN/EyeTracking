import React from 'react';

const ButtonGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-8 h-screen bg-gradient-to-r from-indigo-500 to-black">
      {[...Array(6)].map((_, index) => (
        <button
          key={index}
          className="grid-button w-[100%] h-[100%] rounded-2xl text-white border-none cursor-pointer transition-shadow duration-300 ease-in-out focus:outline-none shadow-lg hover:shadow-xl"
          style={{ flexGrow: 1, backgroundColor: 'rgb(59, 130, 246)' }} // Default blue color
        >
          Button {index + 1}
        </button>
      ))}
    </div>
  );
};

export default ButtonGrid;

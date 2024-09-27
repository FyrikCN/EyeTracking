import React from 'react';

const Popup = ({ isOpen, onClose, earnings, onPlayAgain, onReCalibrate }) => {
  if (!isOpen) return null; // 如果未打开，返回 null

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white border border-white rounded-lg p-6 text-center">
        <h2 className="text-lg font-bold mb-2">Congratulations!</h2>
        <p className="mb-4">You earned ${earnings}!</p>
        <div className="flex justify-around space-x-2">
          <button
            onClick={onPlayAgain}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Play Again
          </button>
          <button
            onClick={onReCalibrate}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            ReCalibrate
          </button>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

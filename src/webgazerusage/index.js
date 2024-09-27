import React, { useEffect, useState } from 'react';
import webgazer from 'webgazer';
import Calibration from './calibration';
import ButtonGrid from '../buttonspage';
import Popup from '../components/Popup.js';
import './index.css';

const WebGazerUsage = () => {
  const [gazeData, setGazeData] = useState({ x: 0, y: 0 });
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const [timer, setTimer] = useState(0);
  const [gazeTimers, setGazeTimers] = useState(Array(6).fill(null));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameInterval, setGameInterval] = useState(null); // 新增状态以管理定时器

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
      clearInterval(gameInterval); // 清理定时器
    };
  }, []);

  useEffect(() => {
    if (isCalibrated) {
      startGame(); // 直接开始游戏
    }
  }, [isCalibrated]);

  const startGame = () => {
    webgazer.begin(); // 启动WebGazer
    setIsCalibrated(true); // 设置为已校准

    // 随机排列图像
    const shuffledIndices = [...Array(6).keys()].sort(() => 0.5 - Math.random());
    setCurrentImages(shuffledIndices);

    // 启动定时器
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev >= 19) { // 20秒结束
          clearInterval(interval);
          webgazer.end(); // 结束WebGazer
          console.log(`Total Earnings: $${formatEarnings(totalEarnings)}`);
          handleShowModal();
          return prev; // 返回当前值以停止更新
        }
        return prev + 5; // 每5秒增加
      });

      // 随机排列图像
      const newShuffledIndices = [...Array(6).keys()].sort(() => 0.5 - Math.random());
      setCurrentImages(newShuffledIndices);
    }, 5000);

    setGameInterval(interval); // 保存定时器的引用
  };

  const handlePlayAgain = () => {
    setTotalEarnings(0);
    setTimer(0);
    setGazeTimers(Array(6).fill(null));
    setIsModalOpen(false);
    clearInterval(gameInterval); // 清理之前的定时器
    startGame(); // 直接开始游戏
  };

  const getButtonElements = () => {
    return document.querySelectorAll('.grid-button');
  };

  const checkGazeOnButton = () => {
    const buttons = getButtonElements();
    const { x, y } = gazeData;

    buttons.forEach((button, index) => {
      const rect = button.getBoundingClientRect();
      const isGazed = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

      if (isGazed) {
        button.classList.add('bg-button-gazed');
        button.classList.remove('bg-button-coin-default');

        // 如果当前按钮没有计时器，则启动计时器
        if (!gazeTimers[index]) {
          const timer = setTimeout(() => {
            const imageName = button.getAttribute('data-image-name');
            let number = '0';
            if (imageName) {
              const parts = imageName.split('.');
              if (parts.length > 0) {
                number = parts[0];
              }
            }

            !isModalOpen && setTotalEarnings(totalEarnings + (parseInt(number) + 1) * 200);
            generatePopUp(button, index);
            setGazeTimers(prev => {
              const newTimers = [...prev];
              newTimers[index] = null;
              return newTimers;
            });
          }, 500); // 500毫秒后显示弹出框

          setGazeTimers(prev => {
            const newTimers = [...prev];
            newTimers[index] = timer;
            return newTimers;
          });
        }
      } else {
        button.classList.add('bg-button-coin-default');
        button.classList.remove('bg-button-gazed');

        // 清理计时器
        if (gazeTimers[index]) {
          clearTimeout(gazeTimers[index]);
          setGazeTimers(prev => {
            const newTimers = [...prev];
            newTimers[index] = null;
            return newTimers;
          });
        }
      }
    });
  };

  const generatePopUp = (button, index) => {
    const imageName = button.getAttribute('data-image-name');
    let number = '0';
    if (imageName) {
      const parts = imageName.split('.');
      if (parts.length > 0) {
        number = parts[0];
      }
    }

    const popUp = document.createElement('div');
    popUp.textContent = `+$${(parseInt(number) + 1) * 200}.00`;
    popUp.className = 'absolute text-white bg-green-500 rounded p-1 border border-white';
    button.appendChild(popUp);

    const rect = button.getBoundingClientRect();
    popUp.style.position = 'absolute';
    popUp.style.top = `${rect.top + window.scrollY + (rect.height * 0.3)}px`;
    popUp.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (popUp.offsetWidth / 2)}px`;

    // 渐变消失效果
    setTimeout(() => {
      popUp.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      popUp.style.opacity = '0';
      popUp.style.transform = 'translateY(-20px)';
    }, 500);

    setTimeout(() => {
      popUp.remove();
    }, 1000);
  };

  const handleShowModal = () => {
    setIsModalOpen(true);
  };

  const formatEarnings = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  const handleCalibrationFinish = () => {
    setIsCalibrated(true);
    // 立即打乱图像
    const shuffledIndices = [...Array(6).keys()].sort(() => 0.5 - Math.random());
    setCurrentImages(shuffledIndices); // 立即显示按钮
    // 立即开始计时器
    setTimer(0); // 重置计时器从0开始
  };

  useEffect(() => {
    checkGazeOnButton();
  }, [gazeData]);

  return (
    <div>
      {!isCalibrated ? (
        <Calibration onFinishCalibration={handleCalibrationFinish} webgazer={webgazer} />
      ) : (
        <>
          <div className="absolute top-0 left-0 p-4 text-white z-10">
            You earned ${formatEarnings(totalEarnings)}
          </div>
          <ButtonGrid onReCalibration={() => {
            webgazer.end();
            setIsCalibrated(false);
            setTotalEarnings(0)
          }} currentImages={currentImages} />
          <Popup
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            earnings={formatEarnings(totalEarnings)}
            onPlayAgain={handlePlayAgain}
            onReCalibrate={() => {
              webgazer.end();
              setIsCalibrated(false);
              setIsModalOpen(false);
              setTotalEarnings(0)
            }}
          />
        </>
      )}
    </div>
  );
};

export default WebGazerUsage;

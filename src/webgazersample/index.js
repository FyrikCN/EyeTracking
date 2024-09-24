import React, { useEffect } from 'react';
import webgazer from 'webgazer';

const WebGazerSample = () => {
  useEffect(() => {
    console.log("initiating");

    // 增加一个延迟来确保 WebGazer 完全加载
    setTimeout(() => {
      webgazer.setRegression('ridge') // 设置回归模型
        .setGazeListener((data, elapsedTime) => {
          if (data) {
            // data.x, data.y 是眼动位置的 X 和 Y 坐标
          }
        })
        .begin()
        // .showVideo(false) // 隐藏视频窗口
        // .showPredictionPoints(true); // 显示预测点
    }, 2000); // 调整延迟时间

    return () => {
      // 清理 WebGazer 实例
      webgazer.end();
    };
  }, []);

  return (
    <div>
      <h1>WebGazer Eye Tracking</h1>
      <p>查看控制台中的眼动数据。</p>
    </div>
  );
};

export default WebGazerSample;

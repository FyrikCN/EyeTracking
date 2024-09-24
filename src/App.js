// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import GazeTrackingSample from './gazetrackingsample';
import WebGazerSample from './webgazersample';
import WebGazerUsage from './webgazerusage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 设置主页 ("/") 渲染 WebGazerPage */}
          <Route path="/" element={<GazeTrackingSample />} />
          {/* 保留 /webgazer 路径 */}
          {/* <Route path="/webgazersample" element={<WebGazerSample />} /> */}
          <Route path="/webgazer" element={<WebGazerUsage />} />
          
          <Route path="/gazetrackingsample" element={<GazeTrackingSample />} />
          {/* 示例其他路径 */}
          <Route path="/other" element={<h1>This is another page</h1>} />
          {/* 使用 Navigate 组件进行重定向 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

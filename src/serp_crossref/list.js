import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './index.css'; // 动画的CSS
import webgazer from 'webgazer'; // 引入 WebGazer

const List = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePaper, setActivePaper] = useState(null); // 添加这一行
    const activePaperRef = useRef(null); // 使用 ref 存储当前文献
    const gazeTimeout = useRef(null); // 用于计时注视的 timeout
    const lastGazeIndex = useRef(null); // 记录最后注视的块索引
    const scrollContainerRef = useRef(null); // 引用滚动容器
    const [gazedIndex, setGazedIndex] = useState(-1)
    const paperWidth = 1024
    const paperHeight = 200
    const popupWidth = 600
    const popupHeight = 400

    const API_URL = 'https://api.crossref.org/works';

    useEffect(() => {
        const fetchPaperDetails = async () => {
            try {
                const response = await axios.get(API_URL, {
                    params: {
                        query: 'eye tracker',
                        rows: 10, // 示例设置为 10 个块
                        filter: 'type:journal-article',
                    }
                });
                setPapers(response.data.message.items);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPaperDetails();
    }, []);

    useEffect(() => {
        if (papers.length > 0) {
            // 初始化 WebGazer
            webgazer.setGazeListener((data) => {
                if (data == null) return; // 没有数据则返回

                const { x, y } = data; // 获取用户的眼动坐标
                handleGaze(x, y);
            })
            // .begin();

            // 添加页面可见性检测，避免切换窗口后影响 WebGazer 功能
            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    webgazer.resume();
                } else {
                    webgazer.pause();
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);

            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                webgazer.end();
            };
        }
    }, [papers]);

    let timerActive = false;
    const handleGaze = (x, y) => {
        if (papers.length === 0) return; // 如果 papers 还没有加载完成，跳过

        const scrollOffset = scrollContainerRef.current.scrollTop; // 获取滚动容器的 scrollTop
        let gazedIndex = null;

        for (let index = 0; index < papers.length; index++) {
            const blockTop = index * 220 + 50 - scrollOffset;
            const blockBottom = blockTop + paperHeight;
            const blockLeft = window.innerWidth / 2 - paperWidth / 2
            const blockRight = blockLeft + paperWidth

            if (x > blockLeft && x < blockRight && y > blockTop && y < blockBottom) {
                gazedIndex = index;
                break;
            }
        }

        // 如果当前有弹窗，处理关闭弹窗的逻辑
        if (activePaperRef.current) {
            setGazedIndex(-1)
            const modalCenterX = window.innerWidth / 2;
            const modalCenterY = window.innerHeight / 2;
            const modalWidth = popupWidth;
            const modalHeight = popupHeight;

            const modalLeft = modalCenterX - modalWidth / 2;
            const modalRight = modalCenterX + modalWidth / 2;
            const modalTop = modalCenterY - modalHeight / 2;
            const modalBottom = modalCenterY + modalHeight / 2;

            // 检查注视位置是否在弹窗内
            if (x < modalLeft || x > modalRight || y < modalTop || y > modalBottom) {
                console.log('在弹窗外');

                if (!timerActive) { // 只有当没有定时器时才设置新定时器
                    gazeTimeout.current = setTimeout(() => {
                        setActivePaper(null); // 显示弹窗
                        activePaperRef.current = null; // 关闭弹窗
                        timerActive = false; // 定时器完成，重置标志
                    }, 1000);
                    timerActive = true; // 设置标志为活动状态
                }
            } else {
                clearTimeout(gazeTimeout.current); // 在弹窗内注视，清除计时器
                timerActive = false; // 重置标志
            }

            return; // 如果弹窗已显示，终止该函数
        }

        // 如果没有弹窗，处理注视块的逻辑
        if (gazedIndex !== lastGazeIndex.current) {
            clearTimeout(gazeTimeout.current);
            lastGazeIndex.current = gazedIndex;
            setGazedIndex(gazedIndex)

            if (gazedIndex !== null) {
                gazeTimeout.current = setTimeout(() => {
                    if (gazedIndex === lastGazeIndex.current) {
                        activePaperRef.current = papers[gazedIndex]; // 将当前文献存入 ref
                        setActivePaper(activePaperRef.current); // 显示弹窗
                    }
                }, 1000);
            }
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center">Error: {error}</div>;

    return (
        <>
            {/* 背景层，位于底层 */}
            <div className="h-screen overflow-y-auto flex flex-col items-center my-6 z-0" ref={scrollContainerRef}>
                {papers.map((paper, index) => (
                    <div
                        key={index}
                        className={`relative w-[${paperWidth}px] min-h-[${paperHeight}px] mb-4 p-4 flex flex-col justify-center border border-transparent rounded-lg transition-all duration-300 ${gazedIndex === index ? 'border-gray-300 shadow-[0_0_30px_rgba(0,0,0,0.2)]' : ''
                            }`}
                    >
                        <h2 className="mb-[2px] text-xl font-semibold text-title text-[17px] leading-[19px]">{paper.title || 'No title available'}</h2>
                        <p className="text-sm text-authors text-[13px] leading-[19px]">
                            {paper.author
                                ? paper.author.map((author) => author.name || (author.given + ' ' + author.family)).join(', ')
                                : 'No authors available'}
                            {' - '}
                            {paper.created ? paper.created['date-parts'][0][0] : 'No year available'}
                            {' - '}
                            {paper.publisher}
                        </p>
                        <p className="text-sm text-gray-900 line-clamp-2 my-[2px]">{paper.abstract
                            ? paper.abstract.replace('<jats:p>', '').replace('</jats:p>', '')
                            : 'No abstract available'}</p>
                        <p className="text-[13px] text-operations line-clamp-2 space-x-2">
                            <span>Reference: {paper['reference-count'] ?? '0'}</span>
                            <span>Cited by {paper['is-referenced-by-count'] ?? '0'}</span>
                        </p>
                    </div>
                ))}
            </div>

            {/* 遮罩层，50%透明度 */}
            {activePaperRef.current && (
                <div
                    className="fixed inset-0 bg-white bg-opacity-50 z-10"
                >
                    {/* 弹窗，宽600高400 */}
                    <div
                        className={`fixed top-1/2 left-1/2 w-[${popupWidth}px] h-[${popupHeight}px] bg-white rounded-lg shadow-lg z-20 transform -translate-x-1/2 -translate-y-1/2 p-6`}
                    >
                        <div className="relative block-content">
                            <h2 className="text-xl font-semibold text-[#660099]">{activePaperRef.current.title || 'No title available'}</h2>
                            <p className="text-sm text-gray-600">
                                Authors: <span className='text-authors'>{activePaperRef.current.author
                                    ? activePaperRef.current.author.map((author) => author.name || (author.given + ' ' + author.family)).join(', ')
                                    : 'No authors available'}</span>
                            </p>
                            <p className="text-sm text-gray-600">Year: <span className='text-authors'>{activePaperRef.current.created ? activePaperRef.current.created['date-parts'][0][0] : 'No year available'}</span></p>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-6">
                                Abstract: {activePaperRef.current.abstract
                                    ? activePaperRef.current.abstract.replace('<jats:p>', '')
                                    : 'No abstract available'}
                            </p>
                            <p className="text-[13px] text-operations line-clamp-2 space-x-2">
                                <span>Reference: {activePaperRef.current['reference-count'] ?? '0'}</span>
                                <span>Cited by {activePaperRef.current['is-referenced-by-count'] ?? '0'}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default List;

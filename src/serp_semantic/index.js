// App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const mock = {
  "data": [
    { "paperId": "d138f63af53b4e5d4da59653e59bb34a98a94073", "title": "Eye Tracking in Virtual Reality: a Broad Review of Applications and Challenges" },
    { "paperId": "1168a76dfc00efbd829391e2d444468e2a96fb5a", "title": "Eye tracking and eye expression decoding based on transparent, flexible and ultra-persistent electrostatic interface" },
    { "paperId": "c6c0cbd009eaff35ee042fef4248abb97b599ce5", "title": "RETRACTED ARTICLE: Eye tracking: empirical foundations for a minimal reporting guideline" },
    { "paperId": "8a74bbf57b69607baf41e3d1fcd479cc7a45b6f8", "title": "The Eye in Extended Reality: A Survey on Gaze Interaction and Eye Tracking in Head-worn Extended Reality" },
  ]
};

const SERPSemantic = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = '你的API密钥'; // 替换成你的 API 密钥
  const baseUrl = 'https://api.semanticscholar.org/graph/v1/paper/batch';

  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        const paperIds = mock.data.map(paper => paper.paperId);
        const response = await axios.post(
          baseUrl,
          { ids: paperIds, fields: "title,authors,year,url,abstract" },
        //   {
        //     headers: {
        //       'x-api-key': API_KEY, // 替换成你的 API 密钥
        //     },
        //   }
        );
        setPapers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPaperDetails();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center">Error: {error}</div>;

  return (
    <div className="h-screen overflow-y-auto flex flex-col items-center py-6">
      {papers.map((paper, index) => (
        <div
          key={index}
          className="w-[1024px] h-[150px] border border-gray-300 shadow-md mb-4 p-4 flex flex-col justify-center"
        >
          <h2 className="text-xl font-semibold">{paper.title || 'Title'}</h2>
          <p className="text-sm text-gray-600">
            Authors: {paper.authors?.map((author) => author.name).join(', ') || 'Authors'}
          </p>
          <p className="text-sm text-gray-600">Year: {paper.year || 'Year'}</p>
        </div>
      ))}
    </div>
  );
};

export default SERPSemantic;

// Overlay.js
import React from 'react';

const Overlay = ({ isActive, paper, onClose }) => {
  return (
    <div className={`overlay ${isActive ? 'active' : ''}`} onClick={onClose}>
      {isActive && (
        <div className="text-center">
          <h2 className="text-xl font-semibold">{paper.title || 'No title available'}</h2>
          <p className="text-sm text-gray-600">
            Authors: {paper.author ? paper.author.map((author) => `${author.given} ${author.family}`).join(', ') : 'No authors available'}
          </p>
          <p className="text-sm text-gray-600">Year: {paper.created ? paper.created['date-parts'][0][0] : 'No year available'}</p>
          <p className="text-sm text-gray-600 mt-2">
            Abstract: {paper.abstract ? paper.abstract.replace('<jats:p>', '').replace('</jats:p>', '') : 'No abstract available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Overlay;

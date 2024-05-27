import React, { useState, useEffect } from 'react';
import './Results.css';

interface Winner {
  fileName: string;
}

const Results: React.FC = () => {
  const [winner, setWinner] = useState<Winner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedWinner = localStorage.getItem('winner');
    const winnerTimestamp = localStorage.getItem('winnerTimestamp');
    const now = new Date().getTime();
    
    if (savedWinner && winnerTimestamp && now - parseInt(winnerTimestamp, 10) < 24 * 60 * 60 * 1000) {
      setWinner(JSON.parse(savedWinner));
      setLoading(false);
    } else {
      fetch('https://localhost:7025/api/upload/winner')
        .then(response => response.json())
        .then((data: { winner: Winner }) => {
          setWinner(data.winner);
          setLoading(false);
          localStorage.setItem('winner', JSON.stringify(data.winner));
          localStorage.setItem('winnerTimestamp', now.toString());
        })
        .catch(error => {
          console.error('Error fetching winner:', error);
          setError('Error fetching winner');
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="results-page">
      <h2>And the winner is...</h2>
      {loading ? (
        <p>Loading winner...</p>
      ) : error ? (
        <p>{error}</p>
      ) : winner ? (
        <div className="winner">
          <img
            src={`https://localhost:7025/uploads/${winner.fileName}`}
            alt="Winning entry"
            onError={(e) => {
              console.error('Error loading image:', e);
              e.currentTarget.src = ''; // Clear the src to avoid repeated requests
              e.currentTarget.alt = 'Image not available';
              setError('Image not available');
            }}
          />
          <p>Congratulations, {winner.fileName}!</p>
        </div>
      ) : (
        <p>No winner found or an error occurred.</p>
      )}
    </div>
  );
};

export default Results;

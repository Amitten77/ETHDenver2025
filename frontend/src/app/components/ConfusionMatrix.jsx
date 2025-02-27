'use client';

import React, { useState, useEffect } from 'react';

const ConfusionMatrix = ({ matrix, benchmark }) => {
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    // Fetch labels from the JSON file
    fetch('/benchmark_labels.json')
      .then((res) => res.json())
      .then((data) => {
        if (data[benchmark]) {
          setLabels(data[benchmark]);
        }
      })
      .catch((err) => console.error('Error loading labels:', err));
  }, [benchmark]);

  if (!matrix || matrix.length === 0) return <p>No data available</p>;

  return (
    <div>
      <p><strong>Confusion Matrix:</strong></p>
      <table style={{ borderCollapse: 'collapse', textAlign: 'center', marginTop: '10px' }}>
        <thead>
          <tr>
            <th></th> {/* Empty top-left corner cell */}
            <th colSpan={labels.length}>Predicted</th>
          </tr>
          <tr>
            <th>Actual</th>
            {labels.map((label, index) => (
              <th key={index} style={{ padding: '10px', border: '1px solid black' }}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th style={{ padding: '10px', border: '1px solid black' }}>{labels[rowIndex] || `Class ${rowIndex}`}</th>
              {row.map((value, colIndex) => (
                <td 
                  key={colIndex} 
                  style={{ padding: '10px', border: '1px solid black' }}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConfusionMatrix;
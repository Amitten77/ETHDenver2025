import React from "react";

const BenchmarkModal = ({ benchmark, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <img
            src="spider_logo.png"
            alt={benchmark.model}
            className="modal-image"
          />
          <div>
            <h2>{benchmark.model}</h2>
            <h3>
              Testing <b>{benchmark.benchmark}</b>
            </h3>
          </div>
        </div>
        <p>
          <strong>Accuracy:</strong> {benchmark.accuracy}%
        </p>
        <p>
          <strong>Stakers:</strong> {benchmark.count}
        </p>
        <p>
          <strong>Yield:</strong> ${2730}
        </p>
        <p>
          <strong>Last Tested:</strong> {benchmark.entry_time}
        </p>
      </div>
    </div>
  );
};

export default BenchmarkModal;

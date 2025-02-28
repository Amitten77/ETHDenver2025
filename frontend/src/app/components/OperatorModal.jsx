import React from "react";
import DelegateInput from "./DelegateInput";

const OperatorModal = ({ operator }) => {
  // console.log(operator.key);

  return (
    <div
      className="operator-modal modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <img
          src={`operator${operator.id % 6}.png`}
          alt={operator.operator}
          className="modal-image"
        />
        <div>
          <h2>{operator.operator}</h2>
          <h3>{operator.apr} APR</h3>
        </div>
      </div>
      <p>
        <strong>ETH Staked:</strong> {operator.eth_staked}
      </p>
      <p>
        <strong>Tot. Stakers</strong> {operator.stakers}
      </p>

      <DelegateInput operator={operator}></DelegateInput>
    </div>
  );
};

export default OperatorModal;

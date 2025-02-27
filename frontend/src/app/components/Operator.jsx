import React from "react";

const Operator = ({
  imageSrc,
  operator,
  eth_staked,
  stakers,
  apr,
  onClick,
  isActive,
}) => {
  return (
    <div
      className={
        "operator_content" +
        " " +
        `operator_content ${isActive ? "active_operator" : ""}`
      }
      onClick={onClick}
    >
      <img src={imageSrc}></img>
      <h3 className={"img_model_text benchmark_text"}>{operator}</h3>
      <h3 className={"benchmark_text"}>{eth_staked}</h3>
      <h3 className={"benchmark_text"}>{stakers}</h3>
      <h3 className={"benchmark_text"}>{apr}</h3>
    </div>
  );
};

export default Operator;

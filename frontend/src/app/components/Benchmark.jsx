import React from "react";

const Benchmark = ({
  imageSrc,
  model,
  accuracy,
  stakersNum,
  cost,
  testDate,
}) => {
  return (
    <div className={"benchmark_content"}>
      <img src={imageSrc}></img>
      <h3 className={"model_text benchmark_text"}>{model}</h3>
      <h3 className={"benchmark_text"}>{`${accuracy}%`}</h3>
      <h3 className={"benchmark_text"}>{stakersNum}</h3>
      <h3 className={"benchmark_text"}>{`${cost} hETH/test`}</h3>
      <h3 className={"benchmark_text"}>{testDate}</h3>
    </div>
  );
};

export default Benchmark;

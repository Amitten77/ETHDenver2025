import React from "react";

const Benchmark = ({
  imageSrc,
  model,
  benchmark,
  accuracy,
  stakersNum,
  yields,
  testDate,
  onClick,
}) => {
  return (
    <div className={"benchmark_content"} onClick={onClick}>
      <img src={imageSrc}></img>
      <h3 className={"img_model_text benchmark_text"}>{model}</h3>
      <h3 className={"model_text benchmark_text"}>{benchmark}</h3>
      <h3 className={"benchmark_text"}>{`${accuracy}%`}</h3>
      <h3 className={"benchmark_text"}>{stakersNum}</h3>
      <h3 className={"benchmark_text"}>{`$${yields}`}</h3>
      <h3 className={"benchmark_text"}>{testDate}</h3>
    </div>
  );
};

export default Benchmark;

import React from "react";
import NavBar from "../components/NavBar";
import Benchmark from "../components/Benchmark";

const BenchmarksPage = () => {
  return (
    <div className={"main"}>
      <NavBar activeIdx={0}></NavBar>
      <div className={"page_start_spacer"}></div>
      <div className={"header_content content_box"}>
        <h2>Browse Benchmarks</h2>
        <h3>View available models and request benchmark testing.</h3>
      </div>
      <div className={"leaderboard content_box"}>
        <div className={"leaderboard_header"}>
          <h3 className={"model_text lb_header_text"}>Model</h3>
          <h3 className={"lb_header_text"}>Past Acc.</h3>
          <h3 className={"lb_header_text"}>Tot. Stakers</h3>
          <h3 className={"lb_header_text"}>Est. Tot. Cost</h3>
          <h3 className={"lb_header_text"}>Last Tested</h3>
        </div>
        <Benchmark
          imageSrc="spider_logo.png"
          model="Llama"
          accuracy={0.77}
          stakersNum={1753}
          cost={0.00001}
          testDate={"02/24/2025"}
        ></Benchmark>
      </div>
    </div>
  );
};

export default BenchmarksPage;

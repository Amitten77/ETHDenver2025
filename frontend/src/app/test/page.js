"use client";

import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

import { Tourney } from "next/font/google";

const tourney = Tourney({ subsets: ["latin"] });

const TestPage = () => {
  return (
    <div className={"main"}>
      <NavBar activeIdx={2}></NavBar>
      <div className={"page_start_spacer"}></div>
      <div className={"header_content content_box"}>
        <h2 className={tourney.className}>Test a Model</h2>
        <h3>Upload a model and run it against our benchmarks.</h3>
      </div>
    </div>
  );
};

export default TestPage;

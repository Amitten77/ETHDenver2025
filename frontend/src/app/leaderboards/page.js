"use client";

import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Benchmark from "../components/Benchmark";
import SortArrow from "../components/SortArrow";
import BenchmarkModal from "../components/BenchmarkModal";

import { Tourney } from "next/font/google";

const tourney = Tourney({ subsets: ["latin"] });

const BenchmarksPage = () => {
  const [benchmarkData, setBenchmarkData] = useState([]);

  const [selectedBenchmark, setSelectedBenchmark] = useState(null);

  const [activeCategory, setActiveCategory] = useState(null);
  const [currDir, setCurrDir] = useState(0);

  const sortingMapDescending = new Map([
    ["model", (a, b) => a.model.localeCompare(b.model)],
    ["benchmark", (a, b) => a.benchmark.localeCompare(b.benchmark)],
    ["accuracy", (a, b) => b.accuracy - a.accuracy],
    ["count", (a, b) => b.count - a.count],
    ["entry_time", (a, b) => new Date(b.entry_time) - new Date(a.entry_time)],
  ]);

  const sortingMapAscending = new Map([
    ["model", (a, b) => b.model.localeCompare(a.model)],
    ["benchmark", (a, b) => b.benchmark.localeCompare(a.benchmark)],
    ["accuracy", (a, b) => a.accuracy - b.accuracy],
    ["count", (a, b) => a.count - b.count],
    ["entry_time", (a, b) => new Date(a.entry_time) - new Date(b.entry_time)],
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/modeldata");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        // Makes minor formatting changes
        const updatedData = data.map((d) => ({
          ...d,
          accuracy: parseFloat((d.accuracy * 100).toFixed(2)),
          entry_time: new Date(d.entry_time).toLocaleDateString("en-US"),
        }));

        // Groups data if both benchmark and model name is same
        // Takes the latest entry_time and accuracy
        // Counts the amount of tests
        const groupedData = Object.values(
          updatedData.reduce((acc, entry) => {
            const key = `${entry.benchmark}-${entry.model}`; // Unique key for grouping

            if (!acc[key]) {
              acc[key] = { ...entry, count: 1 };
            } else {
              acc[key].count += 1;

              // Update latest entry_time and stakersNum
              if (new Date(entry.entry_time) > new Date(acc[key].entry_time)) {
                acc[key].entry_time = entry.entry_time;
                acc[key].accuracy = entry.accuracy;
              }
            }
            return acc;
          }, {})
        );

        console.log(groupedData);

        const sortFunction = sortingMapDescending.get("accuracy");
        setBenchmarkData([...groupedData].sort(sortFunction)); // Store the date into benchmarkData
      } catch (error) {
        console.error("Could not fetch the data", error);
      }
    };
    fetchData();
  }, []);

  function handleSortChange(dir, category) {
    console.log(dir, category);

    if (category !== activeCategory) {
      setCurrDir(1); // Set to first sort direction
    } else {
      setCurrDir(dir);
    }

    setActiveCategory(category);

    if (dir == 0) {
      const sortFunction = sortingMapDescending.get("accuracy");
      setBenchmarkData([...benchmarkData].sort(sortFunction));
    }

    // Descending Sort
    if (dir == 1) {
      const sortFunction = sortingMapDescending.get(category);
      // console.log(sortFunction);
      setBenchmarkData([...benchmarkData].sort(sortFunction));
    }

    // Ascending Sort
    if (dir == 2) {
      const sortFunction = sortingMapAscending.get(category);
      // console.log(sortFunction);
      setBenchmarkData([...benchmarkData].sort(sortFunction));
    }
  }

  return (
    <div className={"main"}>
      <NavBar activeIdx={0}></NavBar>
      <div className={"page_start_spacer"}></div>
      <div className={"header_content content_box"}>
        <h2 className={tourney.className}>Browse Benchmarks</h2>
        <h3>View available models and request benchmark testing.</h3>
      </div>
      <div className={"leaderboard content_box"}>
        <div className={"leaderboard_header"}>
          <h3 className={"model_text lb_header_text"}>
            <div>
              Model
              <SortArrow
                category={"model"}
                handleChange={handleSortChange}
                activeCategory={activeCategory}
                currDirection={currDir}
              ></SortArrow>
            </div>
          </h3>
          <h3 className={"model_text lb_header_text"}>
            <div>
              Benchmark
              <SortArrow
                category={"benchmark"}
                handleChange={handleSortChange}
                activeCategory={activeCategory}
                currDirection={currDir}
              ></SortArrow>
            </div>
          </h3>
          <h3 className={"lb_header_text"}>
            <div>
              Past Acc.
              <SortArrow
                category={"accuracy"}
                handleChange={handleSortChange}
                activeCategory={activeCategory}
                currDirection={currDir}
              ></SortArrow>
            </div>
          </h3>
          <h3 className={"lb_header_text"}>
            <div>
              Tot. Stakers
              <SortArrow
                category={"count"}
                handleChange={handleSortChange}
                activeCategory={activeCategory}
                currDirection={currDir}
              ></SortArrow>
            </div>
          </h3>
          <h3 className={"lb_header_text"}>Tot. Yield</h3>
          <h3 className={"lb_header_text"}>
            <div>
              Last Tested
              <SortArrow
                category={"entry_time"}
                handleChange={handleSortChange}
                activeCategory={activeCategory}
                currDirection={currDir}
              ></SortArrow>
            </div>
          </h3>
        </div>
        {benchmarkData && (
          <div className={"leaderboard_content"}>
            {benchmarkData.map((d, i) => {
              return (
                <Benchmark
                  imageSrc={`model${(i % 6) + 1}.png`}
                  model={d.model}
                  benchmark={d.benchmark}
                  accuracy={d.accuracy}
                  stakersNum={d.count}
                  yields={200283}
                  testDate={d.entry_time}
                  key={d._id}
                  onClick={() => setSelectedBenchmark(d)}
                ></Benchmark>
              );
            })}
          </div>
        )}
      </div>

      <div className={"footer content_box"}>
        <h3>Made by Dylan Subramanian and Amit Krishnaiyer</h3>
        <h3>Built with Othentic and P2P for EigenGames 2025</h3>
      </div>

      {/* Modal - Renders only if a benchmark is selected */}
      {selectedBenchmark && (
        <BenchmarkModal
          benchmark={selectedBenchmark}
          onClose={() => setSelectedBenchmark(null)}
        />
      )}
    </div>
  );
};

export default BenchmarksPage;

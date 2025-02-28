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

    // Sorting for entry_time_hours (Descending: newest first)
    [
      "entry_time_hours",
      (a, b) => {
        const getHours = (str) =>
          str === "Now" ? 0 : parseInt(str.split(" ")[0]);
        return getHours(a.entry_time_hours) - getHours(b.entry_time_hours);
      },
    ],
  ]);

  const sortingMapAscending = new Map([
    ["model", (a, b) => b.model.localeCompare(a.model)],
    ["benchmark", (a, b) => b.benchmark.localeCompare(a.benchmark)],
    ["accuracy", (a, b) => a.accuracy - b.accuracy],
    ["count", (a, b) => a.count - b.count],
    ["entry_time", (a, b) => new Date(a.entry_time) - new Date(b.entry_time)],

    // Sorting for entry_time_hours (Ascending: oldest first)
    [
      "entry_time_hours",
      (a, b) => {
        const getHours = (str) =>
          str === "Now" ? 0 : parseInt(str.split(" ")[0]);
        return getHours(b.entry_time_hours) - getHours(a.entry_time_hours);
      },
    ],
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3536/modeldata");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        const now = new Date();

        // Format and add entry_time_hours property
        const updatedData = data.map((d) => {
          const entryDate = new Date(d.entry_time);
          const timeDiffMs = now - entryDate;
          const timeDiffHours = Math.floor(timeDiffMs / (1000 * 60 * 60)); // Convert to hours

          let timeAgo;
          if (timeDiffHours < 1) {
            timeAgo = "Now";
          } else if (timeDiffHours === 1) {
            timeAgo = "1 hour ago";
          } else {
            timeAgo = `${timeDiffHours} hours ago`;
          }

          return {
            ...d,
            accuracy: parseFloat((d.accuracy * 100).toFixed(2)),
            entry_time: entryDate.toLocaleDateString("en-US"),
            entry_time_hours: timeAgo, // New property added
          };
        });

        // Groups data if both benchmark and model name is same
        // Takes the latest entry_time and accuracy
        // Counts the amount of tests
        let num = 1;
        const groupedData = Object.values(
          updatedData.reduce((acc, entry) => {
            const key = `${entry.benchmark}-${entry.model}`; // Unique key for grouping

            if (!acc[key]) {
              acc[key] = { ...entry, count: 1, id: num };
              num += 1;
            } else {
              acc[key].count += 1;

              // Update latest entry_time and stakersNum
              if (new Date(entry.entry_time) > new Date(acc[key].entry_time)) {
                acc[key].entry_time = entry.entry_time;
                acc[key].entry_time_hours = entry.entry_time_hours;
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
              Accuracy
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
              Test Count
              <SortArrow
                category={"count"}
                handleChange={handleSortChange}
                activeCategory={activeCategory}
                currDirection={currDir}
              ></SortArrow>
            </div>
          </h3>
          <h3 className={"lb_header_text"}>
            <div>
              Test Date
              <SortArrow
                category={"entry_time"}
                handleChange={handleSortChange}
                activeCategory={activeCategory}
                currDirection={currDir}
              ></SortArrow>
            </div>
          </h3>
          <h3 className={"lb_header_text"}>
            <div>
              Test Time
              <SortArrow
                category={"entry_time_hours"}
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
                  imageSrc={`model${((d.id - 1) % 6) + 1}.png`}
                  model={d.model}
                  benchmark={d.benchmark}
                  accuracy={d.accuracy}
                  stakersNum={d.count}
                  testDate={d.entry_time}
                  testTime={d.entry_time_hours}
                  key={d.id}
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

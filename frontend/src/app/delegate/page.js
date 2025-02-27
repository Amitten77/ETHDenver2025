"use client";

import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

import { Tourney } from "next/font/google";
import SortArrow from "../components/SortArrow";
import Operator from "../components/Operator";
import OperatorModal from "../components/OperatorModal";

const tourney = Tourney({ subsets: ["latin"] });

const DelegatePage = () => {
  const [operatorData, setOperatorData] = useState([
    { operator: "ZonixTesting", eth_staked: 47, stakers: 37, apr: "1.73%" },
    { operator: "Shuffer", eth_staked: 217, stakers: 117, apr: "1.64%" },
    { operator: "Crious", eth_staked: 674, stakers: 1732, apr: "1.79%" },
  ]);

  const [activeCategory, setActiveCategory] = useState(null);
  const [currDir, setCurrDir] = useState(0);

  const [selectedOperator, setSelectedOperator] = useState(null);

  const sortingMapDescending = new Map([
    ["operator", (a, b) => a.operator.localeCompare(b.operator)],
    ["ethstaked", (a, b) => b.eth_staked - a.eth_staked],
    ["stakers", (a, b) => b.stakers - a.stakers],
    ["apr", (a, b) => a.apr.localeCompare(b.apr)],
  ]);

  const sortingMapAscending = new Map([
    ["operator", (a, b) => b.operator.localeCompare(a.operator)],
    ["ethstaked", (a, b) => a.eth_staked - b.eth_staked],
    ["stakers", (a, b) => a.stakers - b.stakers],
    ["apr", (a, b) => b.apr.localeCompare(a.apr)],
  ]);

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
      setOperatorData([...operatorData].sort(sortFunction));
    }

    // Descending Sort
    if (dir == 1) {
      const sortFunction = sortingMapDescending.get(category);
      // console.log(sortFunction);
      setOperatorData([...operatorData].sort(sortFunction));
    }

    // Ascending Sort
    if (dir == 2) {
      const sortFunction = sortingMapAscending.get(category);
      // console.log(sortFunction);
      setOperatorData([...operatorData].sort(sortFunction));
    }
  }

  return (
    <div className={"main"}>
      <NavBar activeIdx={1}></NavBar>
      <div className={"page_start_spacer"}></div>
      <div className={"header_content content_box"}>
        <h2 className={tourney.className}>Restake your ETH</h2>
        <h3>Contibute to an operator to start earning yield.</h3>
      </div>

      <div className={"content_box operator_main"}>
        <div className={"operator_select"}>
          <div className={"leaderboard_header"}>
            <h3 className={"operator_text lb_header_text"}>
              <div>
                Operator
                <SortArrow
                  category={"operator"}
                  handleChange={handleSortChange}
                  activeCategory={activeCategory}
                  currDirection={currDir}
                ></SortArrow>
              </div>
            </h3>
            <h3 className={"lb_header_text"}>
              <div>
                Eth Staked
                <SortArrow
                  category={"ethstaked"}
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
                  category={"stakers"}
                  handleChange={handleSortChange}
                  activeCategory={activeCategory}
                  currDirection={currDir}
                ></SortArrow>
              </div>
            </h3>
            <h3 className={"lb_header_text"}>
              <div>
                APR
                <SortArrow
                  category={"apr"}
                  handleChange={handleSortChange}
                  activeCategory={activeCategory}
                  currDirection={currDir}
                ></SortArrow>
              </div>
            </h3>
          </div>
          {operatorData && (
            <div className={"leaderboard_content"}>
              {operatorData.map((d, i) => {
                console.log(d);
                d.id = i;
                return (
                  <Operator
                    imageSrc={`model${(i % 6) + 1}.png`}
                    operator={d.operator}
                    eth_staked={d.eth_staked}
                    stakers={d.stakers}
                    apr={d.apr}
                    key={i}
                    onClick={() => setSelectedOperator(d)}
                    isActive={selectedOperator === d}
                  ></Operator>
                );
              })}
            </div>
          )}
        </div>
        <div className={"delegate_right_panels"}>
          <div className="delegate_current">
            <div className={"delegate_current_header"}>
              <h3>Claimable Rewards</h3>
              <h2>{"<"}0.0000 ETH</h2>
              <div className={"delegate_current_options"}>
                <div className={"delegate_current_operator"}>
                  <h3>Current Operator:</h3>
                  <div>
                    <img src={`model${"1"}.png`} />
                    <h2>ZonixTesting</h2>
                  </div>
                </div>
                <div className={"delegate_current_button"}>
                  {/* Button */}
                  <button onClick={() => {}} className="delegate_button">
                    Undelegate
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Modal - Renders only if a benchmark is selected */}
          {selectedOperator && (
            <OperatorModal
              operator={operatorData.find((d) => d === selectedOperator)}
              onClose={() => setSelectedOperator(null)}
            />
          )}
        </div>
      </div>

      <div className={"footer content_box"}>
        <h3>Made by Dylan Subramanian and Amit Krishnaiyer</h3>
        <h3>Built with Othentic and P2P for EigenGames 2025</h3>
      </div>
    </div>
  );
};

export default DelegatePage;

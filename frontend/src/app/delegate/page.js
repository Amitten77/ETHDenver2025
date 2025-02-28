"use client";

import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

import { Tourney } from "next/font/google";
import SortArrow from "../components/SortArrow";
import Operator from "../components/Operator";
import OperatorModal from "../components/OperatorModal";

import { ethers } from "ethers";

const tourney = Tourney({ subsets: ["latin"] });

const DelegatePage = () => {
  const [operatorData, setOperatorData] = useState([
    {
      operator: "ZonixTesting",
      eth_staked: 47,
      stakers: 37,
      apr: "1.73%",
      id: 1,
    },
    { operator: "Shuffer", eth_staked: 217, stakers: 117, apr: "1.64%", id: 2 },
    { operator: "Crious", eth_staked: 674, stakers: 1732, apr: "1.79%", id: 3 },
  ]);

  const [stakerAddress, setStakerAddress] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setStakerAddress(await signer.getAddress());
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  const [stakerEntry, setStakerEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStakerData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3536/stake_data/${stakerAddress}`
        );
        if (response.ok) {
          const data = await response.json();
          setStakerEntry(data);
        } else {
          setStakerEntry(null);
        }
      } catch (error) {
        console.error("Error fetching staker data:", error);
        setStakerEntry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStakerData();
  }, [stakerAddress]);

  const [activeCategory, setActiveCategory] = useState(null);
  const [currDir, setCurrDir] = useState(0);

  const [selectedOperator, setSelectedOperator] = useState(null);

  const sortingMapDescending = new Map([
    ["operator", (a, b) => a.operator.localeCompare(b.operator)],
    ["ethstaked", (a, b) => b.eth_staked - a.eth_staked],
    ["stakers", (a, b) => b.stakers - a.stakers],
    ["apr", (a, b) => b.apr.localeCompare(a.apr)],
  ]);

  const sortingMapAscending = new Map([
    ["operator", (a, b) => b.operator.localeCompare(a.operator)],
    ["ethstaked", (a, b) => a.eth_staked - b.eth_staked],
    ["stakers", (a, b) => a.stakers - b.stakers],
    ["apr", (a, b) => a.apr.localeCompare(b.apr)],
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
        <h3>Contribute to an operator to start earning yield.</h3>
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
              {operatorData.map((d, i) => (
                <Operator
                  imageSrc={`operator${d.id}.png`}
                  operator={d.operator}
                  eth_staked={d.eth_staked}
                  stakers={d.stakers}
                  apr={d.apr}
                  key={i}
                  onClick={() => setSelectedOperator(d)}
                  isActive={selectedOperator === d}
                />
              ))}
            </div>
          )}
        </div>

        <div className={"delegate_right_panels"}>
          {loading ? (
            <p>Loading...</p>
          ) : stakerEntry ? (
            <div className="delegate_current">
              <div className={"delegate_current_header"}>
                <h3>Claimable Rewards</h3>
                <h2>{"<0.0001"} ETH</h2>
                <div className={"delegate_current_options"}>
                  <div className={"delegate_current_operator"}>
                    <h3>Current Operator:</h3>
                    <div>
                      <img
                        src={
                          stakerEntry.operatorName == "ZonixTesting"
                            ? "operator1.png"
                            : stakerEntry.operatorName == "Shuffer"
                            ? "operator2.png"
                            : "operator3.png"
                        }
                        alt="Operator"
                      />
                      <h2>{stakerEntry.operatorName}</h2>
                    </div>
                  </div>
                  <div className={"delegate_current_button"}>
                    <button className="delegate_button">Undelegate</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="delegate_current">
              <div className={"delegate_current_header"}>
                <h3>You haven't staked to anyone yet</h3>
              </div>
            </div>
          )}

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

import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import Swal from "sweetalert2";
import ConfusionMatrix from "./ConfusionMatrix";

const BenchmarkModal = ({ benchmark, onClose }) => {
  const [diffBenchmark, setDiffBenchmark] = useState("");

  async function fetchTransaction(transactionHash) {
    const provider = new ethers.JsonRpcProvider(
      "https://rpc-amoy.polygon.technology"
    );

    const inputData = await provider.getTransaction(transactionHash);

    const hexString = inputData.data;

    const cleanedHex = hexString.startsWith("0x")
      ? hexString.slice(2)
      : hexString;

    const decodedText = Buffer.from(cleanedHex, "hex").toString("utf8");

    const jsonMatch = decodedText.match(/\{.*\}/s); // Extracts content within {}

    if (!jsonMatch) {
      throw new Error("No valid JSON found");
    }

    const jsonString = jsonMatch[0];

    return jsonString;
  }

  const handleAVS = async (avsModel, avsBenchMark) => {
    try {
      var taskResponse = await fetch("http://localhost:4003/task/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: avsModel, benchmark: avsBenchMark }),
      });

      if (!taskResponse.ok) {
        throw new Error("Failed to execute task");
      }

      var taskResult = await taskResponse.json();

      
      Swal.fire({
        title: 'Task Submitted to AVS',
        text: `Preliminary result: \n Accuracy is at ${(JSON.parse(taskResult["data"]["data"])["accuracy"] * 100).toFixed(2)}%`,
        icon: 'success',
        confirmButtonText: 'Ok'
      });

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await sleep(20000);

      const transactionResponse = await fetch(
        "http://localhost:1011/latest-tx"
      );

      const transactionData = await transactionResponse.json();

      console.log(transactionData);

      if (!transactionData.transactionHash) {
        throw new Error("No transaction found");
      }
      // Fetch the transaction hash
      const transactionHash = transactionData.transactionHash;
      const inputData = await fetchTransaction(transactionHash);

      console.log(inputData, "InputData");

      const jsonInputData = JSON.parse(inputData);

      console.log(jsonInputData);

      var mongoModel = jsonInputData.model;

      console.log(mongoModel);

      if (jsonInputData.model.includes("http")) {
        mongoModel = jsonInputData.model.split("/").pop().split(".")[1];
      }

      var mongoResponse = await fetch("http://localhost:3536/add_model_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: mongoModel,
          benchmark: jsonInputData.benchmark,
          accuracy: jsonInputData.accuracy,
          confusion_matrix: jsonInputData.confusion_matrix,
          transactionHash: transactionHash,
        }),
      });

      if (!mongoResponse.ok) {
        console.error("Error:", mongoResponse);
        throw new Error("Failed to execute task");
      }

      Swal.fire({
        title: 'Model Performance Validated!',
        text: `Check out the leaderboard to see how ${avsModel} has performed on ${avsBenchMark}`,
        icon: 'success',
        confirmButtonText: 'Ok'
      })


    } catch (error) {
      console.error("Error:", error);
      alert("Error executing task");
    }
  };

  const handleSubmit = async () => {
    handleAVS(benchmark.model, diffBenchmark);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <img
            src="spider_logo.png"
            alt={benchmark.model}
            className="modal-image"
          />
          <div>
            <h2>{benchmark.model}</h2>
            <h3>
              Testing <b>{benchmark.benchmark}</b>
            </h3>
          </div>
        </div>
        <p>
          <strong>Accuracy:</strong> {benchmark.accuracy}%
        </p>
        <p>
          <strong>Stakers:</strong> {benchmark.count}
        </p>
        <div>
          <ConfusionMatrix matrix={benchmark.confusion_matrix} benchmark={benchmark.benchmark}/>
        </div>
        <p>
          <strong>Last Tested:</strong> {benchmark.entry_time}
        </p>

        <div className="w-64">
          <select
            className="w-full p-2 border rounded"
            value={diffBenchmark}
            onChange={(e) => setDiffBenchmark(e.target.value)}
          >
            <option value="">Select a Different Benchmark</option>
            <option value="fetal_health">Fetal Health Benchmark</option>
            <option value="alzheimers">Alzheimer's MRI Benchmark</option>
            <option value="stroke_risk">Stroke Risk Benchmark</option>
          </select>
        </div>

        <button
          className="w-64 p-2 bg-blue-500 text-white rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default BenchmarkModal;

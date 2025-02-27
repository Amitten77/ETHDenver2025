"use client";

import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

import { Tourney } from "next/font/google";
import { ethers } from "ethers";

const tourney = Tourney({ subsets: ["latin"] });

const TestPage = () => {
  const [benchmark, setBenchmark] = useState("");
  const [modelName, setModelName] = useState("");
  const [modelType, setModelType] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const bucketName = "eigenhealth";
  const region = "us-east-1";

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
      alert(`Execution Result: ${JSON.stringify(taskResult)}`);

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

      const match = inputData.match(/\{.*\}/);

      console.log(match[0]);

      const jsonInputData = JSON.parse(match[0]);

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

      var mongoResult = await mongoResponse.json();

      alert(`Result: ${JSON.stringify(mongoResult)}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Error executing task");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = async () => {
    setUploading(true);
    const fileName = `${modelType}.${modelName}.${file.name}`;
    const uploadUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed!");
      }

      alert("File uploaded successfully!");

      const objectUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

      handleAVS(objectUrl, benchmark);
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={"main"}>
      <NavBar activeIdx={2}></NavBar>
      <div className={"page_start_spacer"}></div>
      <div className={"header_content content_box"}>
        <h2 className={tourney.className}>Test a Model</h2>
        <h3>Upload a model and run it against our benchmarks.</h3>
      </div>
      <div className={"model content_box"}>
        <div className={"add_model"}>
          <div className="w-64">
            <select
              className="w-full p-2 border rounded"
              value={benchmark}
              onChange={(e) => setBenchmark(e.target.value)}
            >
              <option value="">Select Benchmark</option>
              <option value="fetal_health">Fetal Health Benchmark</option>
              <option value="alzheimers">Alzheimer's MRI Benchmark</option>
              <option value="stroke_risk">Stroke Risk Benchmark</option>
            </select>
          </div>

          <div className="mt-8 w-64 p-4 border rounded shadow">
            <h3 className="text-lg font-bold mb-2">Upload File</h3>

            <input
              type="text"
              placeholder="Enter Name"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />

            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded mb-2"
            />

            <select
              className="w-full p-2 border rounded mb-2"
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
            >
              <option value="">Select Model Type</option>
              <option value="keras">Keras</option>
              <option value="sklearn">Sklearn NN</option>
              <option value="llm">LLM</option>
            </select>

            <button
              className="w-full p-2 bg-green-500 text-white rounded"
              onClick={handleFileSubmit}
            >
              Upload File
            </button>
          </div>
        </div>
        <div className={"model_info"}></div>
      </div>
    </div>
  );
};

export default TestPage;

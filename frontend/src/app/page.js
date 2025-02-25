'use client';

import { useState } from 'react';
import { ethers } from "ethers";


export default function DropdownForm() {
  const [model, setModel] = useState('');
  const [benchmark, setBenchmark] = useState('');

  // Test Transaction Hash: 0x070a82285fc757e1a820f73c86a48869c1db07f310e677087bb8e32ffc4bdb6a


  async function fetchTransaction(transactionHash) {
    const provider = new ethers.JsonRpcProvider(
      "https://rpc-amoy.polygon.technology"
    );

    const inputData = await provider.getTransaction(transactionHash);

    const hexString = inputData.data;


    const cleanedHex = hexString.startsWith("0x") ? hexString.slice(2) : hexString;

    const decodedText = Buffer.from(cleanedHex, "hex").toString("utf8");

    const jsonMatch = decodedText.match(/\{.*\}/s); // Extracts content within {}

    if (!jsonMatch) {
        throw new Error("No valid JSON found");
    }

    const jsonString = jsonMatch[0];

    return jsonString;
  }


  const handleSubmit = async () => {
    try {
      var taskResponse = await fetch('http://localhost:4003/task/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, benchmark }),
      });

      if (!taskResponse.ok) {
        throw new Error('Failed to execute task');
      }

      var taskResult = await taskResponse.json();
      alert(`Execution Result: ${JSON.stringify(taskResult)}`);

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      await sleep(10000);

      const transactionResponse = await fetch('http://localhost:1011/latest-tx');

      const transactionData = await transactionResponse.json();

      console.log(transactionData);

      if (!transactionData.transactionHash) {
        throw new Error('No transaction found');
      }
      // Fetch the transaction hash
      const transactionHash = transactionData.transactionHash;
      const inputData = await fetchTransaction(transactionHash)
      
      const jsonInputData = JSON.parse(inputData);

      var mongoResponse = await fetch('http://localhost:3536/add_model_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: jsonInputData.model, benchmark: jsonInputData.benchmark, accuracy: jsonInputData.accuracy, confusion_matrix: jsonInputData.confusion_matrix, transactionHash: transactionHash }),
      });

      if (!mongoResponse.ok) {
        console.error('Error:', mongoResponse);
        throw new Error('Failed to execute task');
      }

      var mongoResult = await mongoResponse.json();

      alert(`Result: ${JSON.stringify(mongoResult)}`);


    } catch (error) {
      console.error('Error:', error);
      alert('Error executing task');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 p-4">
      <div className="w-64">
        <select
          className="w-full p-2 border rounded"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="">Select Model</option>
          <option value="othentic_vital">Othentic Vital</option>
          <option value="carex">CareX</option>
          <option value="biostake">BioStake</option>
        </select>
      </div>

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

      <button className="w-64 p-2 bg-blue-500 text-white rounded" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
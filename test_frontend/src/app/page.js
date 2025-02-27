'use client';

import { useState } from 'react';
import { ethers } from "ethers";
import AWS from "aws-sdk";


export default function DropdownForm() {
  const [model, setModel] = useState('');
  const [benchmark, setBenchmark] = useState('');
  const [operator, setOperator] = useState('');
  const [restakeAmount, setRestakeAmount] = useState(0);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  const [modelName, setModelName] = useState('');
  const [modelType, setModelType] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);


  const contractAddress = "0x974C49387efdBB501606b4CC03eE8d19E667175d"
  const contractABI = [
    "function deposit() external payable",
    "function getBalance() external view returns (uint256)"
  ];

  const bucketName = "eigenhealth";
  const region = "us-east-1";

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

      setAccount(await signer.getAddress());
      setContract(contractInstance);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

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


  const handleAVS = async (avsModel, avsBenchMark) => {
    try {
      var taskResponse = await fetch('http://localhost:4003/task/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: avsModel, benchmark: avsBenchMark }),
      });

      if (!taskResponse.ok) {
        throw new Error('Failed to execute task');
      }

      var taskResult = await taskResponse.json();
      alert(`Execution Result: ${JSON.stringify(taskResult)}`);

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      await sleep(20000);

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

      console.log(jsonInputData);

      var mongoModel = jsonInputData.model;

      console.log(mongoModel)

      if (jsonInputData.model.includes("http")) {
        mongoModel = jsonInputData.model.split("/").pop().split(".")[1];
      }

      var mongoResponse = await fetch('http://localhost:3536/add_model_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: mongoModel, benchmark: jsonInputData.benchmark, accuracy: jsonInputData.accuracy, confusion_matrix: jsonInputData.confusion_matrix, transactionHash: transactionHash }),
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


  }


  const handleSubmit = async () => {

    handleAVS(model, benchmark);

  };

  const handleRestake = async () => {

    if (!contract || !restakeAmount) {
      alert("Please enter an amount and connect wallet");
      return;
    }

    console.log("Dylan Subramanian")

    try {
      console.log("Attempt")
      const tx = await contract.deposit({ value: ethers.parseEther(restakeAmount) });
      console.log("Transaction!")
      await tx.wait();
      alert(`Deposited ${restakeAmount} ETH successfully!`);
    } catch (error) {
      console.error("Deposit error:", error);
      alert("Transaction failed! Check console for details.");
    }



    mongoData = {
      stakerAddress: account,
      operatorName: operator,
      operatorAddress: operator,
      amountStaked: restakeAmount,
      yieldValue: 3.4
    }





    var mongoResponse = await fetch('http://localhost:3536/add_stake_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: mongoModel, benchmark: jsonInputData.benchmark, accuracy: jsonInputData.accuracy, confusion_matrix: jsonInputData.confusion_matrix, transactionHash: transactionHash }),
    }); 



      

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


  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 p-4">

        {account ? (
                <p className="mb-2">Connected: {account}</p>
              ) : (
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}



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

      <div className="w-64">
        <select
          className="w-full p-2 border rounded"
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
        >
          <option value="">Select Operator</option>
          <option value="0x6E704552dED6687192A0A239C5bcf6D1B5fAB16c">Dylan</option>
          <option value="0xcecF4c3db842641C011F5160cF88c26cBCb521F4">Vikram</option>
          <option value="0xdA671Bd9E419eF184344cC734456672B7820CCBc">Keshav</option>
        </select>

        <input
          type="number"
          className="w-full p-2 border rounded mt-2"
          value={restakeAmount}
          onChange={(e) => setRestakeAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>

      <button className="w-64 p-2 bg-blue-500 text-white rounded" onClick={handleRestake}>
        Restake
      </button>

            {/* New File Upload Form */}
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
  );
}
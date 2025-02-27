import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const DelegateInput = ({ operator }) => {
  const [restakeAmount, setRestakeAmount] = useState(0);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const dylanContractAddress = "0x974C49387efdBB501606b4CC03eE8d19E667175d";
  const vikramContractAddress = "0xE1D008D0E5d431aDa64941D5c9c9A6d1CF6B76C7";
  const keshavContractAddress = "0xFdEdcae5E3Ac257E2Cd6B8a5f6469e7132d3116B";

  const dylanAddress = "0x6E704552dED6687192A0A239C5bcf6D1B5fAB16c"
  const vikramAddress = "0xcecF4c3db842641C011F5160cF88c26cBCb521F4"
  const keshavAddress = "0xdA671Bd9E419eF184344cC734456672B7820CCBc"

  const dylanNodeId = "0bb4558b-9756-418d-8aa7-1198382062a6"
  const vikramNodeId = "d1d74e77-89d2-4e34-ba88-a57033f0b291"
  const keshavNodeId = "3e4d511b-bd2f-42d6-93cd-20b5c01eeb9c"

  const contractABI = [
    "function deposit() external payable",
    "function getBalance() external view returns (uint256)"
  ];

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      let contractAddress;
      if (operator.operator == "ZonixTesting") {
        contractAddress = dylanContractAddress;
      } else if (operator.operator == "Shuffer") {
        contractAddress = vikramContractAddress;
      } else if (operator.operator == "Crious") {
        contractAddress = keshavContractAddress;
      }
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

      setAccount(await signer.getAddress());
      setContract(contractInstance);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);


  const handleRestake = async () => {

    if (!contract || !restakeAmount) {
      alert("Please enter an amount and connect wallet");
      return;
    }


    // This code would normally run if Holesky network was up, but for demo purposes only stakers can stake (e.g.)

    // try {
    //   console.log("Attempt")
    //   const tx = await contract.deposit({ value: ethers.parseEther(restakeAmount) });
    //   console.log("Transaction!")
    //   await tx.wait();
    //   alert(`Deposited ${restakeAmount} ETH successfully!`);

    //    // the script report_withdrawl will automatically listen to events emitted by the ETH contract and stake + restake for the user accordingly
    // } catch (error) {
    //   console.error("Deposit error:", error);
    //   alert("Transaction failed! Check console for details.");
    // }

    // let nodeId;

    // if (operator.operator == "ZonixTesting") {
    //   nodeId = dylanNodeId;
    // } else if (operator.operator == "Shuffer") {
    //   nodeId = vikramNodeId;
    // } else if (operator.operator == "Crious") {
    //   nodeId = keshavNodeId;
    // }

    // // instead for demo purposes, we will run this code
    // const url = `https://api-test-holesky.p2p.org/api/v1/eth/staking/direct/nodes-request/status/${nodeId}`;

    // const headers = {
    //     "Accept": "application/json",
    //     "Content-Type": "application/json",
    //     "Authorization": "Bearer scwaeTkXzol07FHmCSzJSMAc9v64qAVp"
    // };

    // const response = await fetch(url, { method: "GET", headers });
    // const data = await response.json();
    // if (data["result"]["status"] == "ready") {
    //   // let's stake!
    //   console.log("Node is ready, staking...");
    // }

    // const stakeUrl = "https://api-test-holesky.p2p.org/api/v1/eth/staking/direct/tx/deposit"


    // const stakeBody = {
    //   "withdrawalAddress": data["result"]["eigenPodAddress"],
    //   "depositData": data["result"]["depositData"]
    // }

    // console.log(stakeBody)

    // const stakeResponse = await fetch(stakeUrl, { method: "POST", headers: headers, body: JSON.stringify(stakeBody) });

    // const stakeData = await stakeResponse.json();

    // console.log(stakeData)

    // const rawTransaction = stakeData["result"]["serializeTx"];

    // let privateKey;

    // if (nodeId == dylanNodeId) {
    //   privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY_DYLAN;
    // } else if (nodeId == vikramNodeId) {
    //   privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY_VIKRAM;
    // } else {
    //   privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY_KESHAV;
    // }

    // // Sign the transaction
    // const transactionResponse = await signAndBroadcast(rawTransaction, privateKey, process.env.NEXT_PUBLIC_RPC_URL, process.env.NEXT_PUBLIC_MAX_FEE_PER_GAS_IN_GWEI, process.env.NEXT_PUBLIC_MAX_PRIORITY_FEE_IN_GWEI);

    // Swal.fire({
    //   title: 'Transaction Successful!',
    //   text: `Transaction hash: ${transactionResponse.hash}`,
    //   icon: "success"
    // })

    let operatorAddress

    if (operator.operator == "ZonixTesting") {
      operatorAddress = dylanAddress;
    } else if (operator.operator == "Shuffer") {
      operatorAddress = vikramAddress;
    } else if (operator.operator == "Crious") {
      operatorAddress = keshavAddress;
    }

    mongoData = {
      stakerAddress: account,
      operatorName: operator.operator,
      operatorAddress: operatorAddress,
      amountStaked: restakeAmount,
      yieldValue: (Math.random() * (8 - 3) + 3).toFixed(2),
    };

    var mongoResponse = await fetch("http://localhost:3536/add_stake_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mongoData),
    }); 

    var mongoData = await mongoResponse.json();

    console.log(mongoData)


      

  };





  return (
    <div className="delegate_options">
      {/* Input Field */}
      <div>
        <p>ETH to Delegate</p>
      </div>

      <input
        type="number"
        placeholder="Enter ETH amount"
        value={restakeAmount}
        onChange={(e) => setRestakeAmount(e.target.value)}
        className="delegate_input"
      />

      {/* Button */}
      <button onClick={handleRestake} className="delegate_button">
        Delegate
      </button>
    </div>
  );
};

async function signAndBroadcast(rawTransaction, privateKey, rpcURL, maxFeePerGas, maxPriorityFeePerGas) {
  console.log("Started");

  console.log("YO", rawTransaction, privateKey, rpcURL, maxFeePerGas, maxPriorityFeePerGas)

  // Enter the selected RPC URL

  // Initialize the provider using the RPC URL
  const provider = new ethers.JsonRpcProvider(rpcURL);

  // Initialize a new Wallet instance
  const wallet = new ethers.Wallet(privateKey, provider);

  // Parse the raw transaction
  const tx = ethers.Transaction.from(rawTransaction);

  const newTx = {
      to: tx.to,
      data: tx.data,
      chainId: tx.chainId,
      value: tx.value,
      gasLimit: tx.gasLimit,
      type: 2,

      nonce: await provider.getTransactionCount(wallet.address),
      // Enter the max fee per gas and prirorty fee
      maxFeePerGas: ethers.parseUnits(maxFeePerGas, 'gwei'),
      maxPriorityFeePerGas: ethers.parseUnits(maxPriorityFeePerGas, 'gwei')
  }

  // Sign the transaction
  const signedTransaction = await wallet.signTransaction(newTx);

  // Send the signed transaction
  const transactionResponse = await provider.broadcastTransaction(signedTransaction);

  console.log(
      "Transaction broadcasted, transaction hash:",
      transactionResponse.hash
  );

  return transactionResponse;
}

export default DelegateInput;

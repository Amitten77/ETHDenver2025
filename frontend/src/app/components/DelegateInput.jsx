import React, { useState } from "react";

const DelegateInput = ({ operator }) => {
  const [restakeAmount, setRestakeAmount] = useState(0);

  const dylanContractAddress = "0x974C49387efdBB501606b4CC03eE8d19E667175d";
  const vikramContractAddress = "0xE1D008D0E5d431aDa64941D5c9c9A6d1CF6B76C7";
  const keshavContractAddress = "0xFdEdcae5E3Ac257E2Cd6B8a5f6469e7132d3116B";

  const handleRestake = async () => {
    console.log(operator, restakeAmount);
    return;

    if (!contract || !restakeAmount) {
      alert("Please enter an amount and connect wallet");
      return;
    }

    try {
      console.log("Attempt");
      const tx = await contract.deposit({
        value: ethers.parseEther(restakeAmount),
      });
      console.log("Transaction!");
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
      yieldValue: (Math.random() * (8 - 3) + 3).toFixed(2),
    };

    var mongoResponse = await fetch("http://localhost:3536/add_stake_data", {
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

    var mongoData = await mongoResponse.json();

    alert(`Result: ${JSON.stringify(mongoResult)}`);
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

export default DelegateInput;

const { ethers } = require("ethers");
const fetch = require("node-fetch");
import signAndBroadcast from "./signTransaction.js";

// Connect to Holesky testnet (use an Infura/Alchemy RPC URL)
const provider = new ethers.JsonRpcProvider("https://eth-holesky.g.alchemy.com/v2/-JlqeWoCEPBVn6XTDRrVSLaECDmU-me2");

// Contract details
const dylanContractAddress = "0x974C49387efdBB501606b4CC03eE8d19E667175d";
const vikramContractAddress = "0xE1D008D0E5d431aDa64941D5c9c9A6d1CF6B76C7";
const keshavContractAddress = "0xFdEdcae5E3Ac257E2Cd6B8a5f6469e7132d3116B";

const dylanNodeId = "0bb4558b-9756-418d-8aa7-1198382062a6"
const vikramNodeId = "d1d74e77-89d2-4e34-ba88-a57033f0b291"
const keshavNodeId = "3e4d511b-bd2f-42d6-93cd-20b5c01eeb9c"


const dylanOperator = "0x6E704552dED6687192A0A239C5bcf6D1B5fAB16c"
const vikramOperator = "0xcecF4c3db842641C011F5160cF88c26cBCb521F4"
const keshavOperator = "0xdA671Bd9E419eF184344cC734456672B7820CCBc"




const contractABI = [
  "event AutoWithdrawTriggered(uint256 amount, address indexed to)"
];

const dylanContract = new ethers.Contract(dylanContractAddress, contractABI, provider);
const vikramContract = new ethers.Contract(vikramContractAddress, contractABI, provider);
const keshavContract = new ethers.Contract(keshavContractAddress, contractABI, provider);


async function stakeAndRestake(address, nodeId, operator) {

  // check if node is ready
  const url = `https://api-test-holesky.p2p.org/api/v1/eth/staking/direct/nodes-request/status/${nodeId}`;

  const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer scwaeTkXzol07FHmCSzJSMAc9v64qAVp"
  };

  try {
    const response = await fetch(url, { method: "GET", headers });
    const data = await response.json();
    if (data["result"]["status"] == "ready") {
      // let's stake!
      console.log("Node is ready, staking...");
    }

    const stakeUrl = "https://api-test-holesky.p2p.org/api/v1/eth/staking/direct/tx/deposit"

    const stakeBody = {
      "withdrawAddress": address,
      "DepositData": [
        {
          "pubkey": "0xaed7226d86d884dd44bc45c2b57f7634e72abf247713163388b1c34d89a1322d7228ca023dbaf2465b822e35ba00da13",
          "signature": "0x91b710f0e3affe704e76ada81b095afbedf4b760f3160760e8fa0298cc4858e0f325c2652dc698ec63c59db65562551114ab7fcafe1d675eaaf186fa7758800f0157bd0b51cd3a131fac562d6933658ddbf182aab8d20a9483b1392085e54cf5",
          "depositDataRoot": "0xd0d00dce54b4ec8a7803783fc786a859459ead1d35b856c525cb289aba4b0f89"
        }
      ]
    }

    const stakeResponse = await fetch(stakeUrl, { method: "POST", headers: headers, body: JSON.stringify(stakeBody) });

    const stakeData = await stakeResponse.json();

    const rawTransaction = stakeData["result"]["serializeTx"];

    let privateKey;

    if (nodeId == dylanNodeId) {
      privateKey = process.env.PRIVATE_KEY_DYLAN;
    } else if (nodeId == vikramNodeId) {
      privateKey = process.env.PRIVATE_KEY_VIKRAM;
    } else {
      privateKey = process.env.PRIVATE_KEY_KESHAV;
    }

    // Sign the transaction
    const transactionResponse = await signAndBroadcast(rawTransaction, privateKey);

    const delegateUrl = "https://api-test-holesky.p2p.org/api/v1/eth/staking/eigenlayer/tx/delegate-to"

    const delegateBody = {
      "operatorAddress": operator
    }

    const delegateResponse = await fetch(delegateUrl, { method: "POST", headers: headers, body: JSON.stringify(delegateBody) });

    const delegateData = await delegateResponse.json();

    const delegateRawTransaction = delegateData["result"]["serializeTx"];

    // Sign the transaction
    const delegateTransactionResponse = await signAndBroadcast(delegateRawTransaction, privateKey);




  } catch (error) {
      console.error("Error fetching data:", error);
  }


}



dylanContract.on("AutoWithdrawTriggered", (amount, to) => {
    console.log(`Auto-withdrawal of ${ethers.formatEther(amount)} ETH sent to Dylan's Staker: ${to}`);

    // Stake and Restake
    stakeAndRestake(dylanContractAddress, dylanNodeId, dylanOperator);

});

// Listen for the AutoWithdrawTriggered event
vikramContract.on("AutoWithdrawTriggered", (amount, to) => {
  console.log(`Auto-withdrawal of ${ethers.formatEther(amount)} ETH sent to Vikram's Staker: ${to}`);

    // Stake and Restake
    stakeAndRestake(vikramContractAddress, vikramNodeId, vikramOperator);
});

// Listen for the AutoWithdrawTriggered event
keshavContract.on("AutoWithdrawTriggered", (amount, to) => {
  console.log(`Auto-withdrawal of ${ethers.formatEther(amount)} ETH sent to Keshav's Staker: ${to}`);

  // Stake and Restake
  stakeAndRestake(keshavContractAddress, keshavNodeId, keshavOperator);
});
require("dotenv").config();
const { ethers } = require('ethers');

async function signAndBroadcast(rawTransaction, privateKey) {
    console.log("Started");

    // Enter the selected RPC URL
    const rpcURL = process.env.RPC_URL;

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
        maxFeePerGas: ethers.parseUnits(process.env.MAX_FEE_PER_GAS_IN_GWEI, 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits(process.env.MAX_PRIORITY_FEE_IN_GWEI, 'gwei')
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

export default signAndBroadcast;
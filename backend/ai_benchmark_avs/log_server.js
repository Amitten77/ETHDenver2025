const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 1011;

app.use(cors());


function getLogFilePath() {
    const logDir = path.join(__dirname, 'log');

    try {
        // Read all files in the log directory
        const files = fs.readdirSync(logDir);
        
        // Find the first file with a .log extension
        const logFile = files.find(file => file.endsWith('.log'));

        if (!logFile) {
            console.error("No log file found in the log directory.");
            return null;
        }

        return path.join(logDir, logFile);
    } catch (error) {
        console.error("Error accessing log directory:", error);
        return null;
    }
}



// Function to get the latest transaction hash
function getLatestTransaction() {
    try {
        const logFilePath = getLogFilePath();
        // Read the file content
        const data = fs.readFileSync(logFilePath, 'utf-8');

        // Split by new lines and reverse to find the latest entry first
        const lines = data.trim().split('\n').reverse();

        for (let line of lines) {
            if (line.includes('tx:')) {
                console.log("LINE: ", line)
                // Extract transaction hash using regex
                const match = line.match(/tx:\s*(0x[a-fA-F0-9]+)/);
                if (match) {
                    return match[1].trim(); // Return the latest transaction hash
                }
            }
        }

        return null; // If no transaction hash found
    } catch (error) {
        console.error("Error reading the log file:", error);
        return null;
    }
}


app.get('/latest-tx', (req, res) => {
    try {
        console.log("GET REQUEST RECIEVED")
        const transactionHash = getLatestTransaction();
        console.log("TRANSACTION HASH: ", transactionHash)
        if (transactionHash) {
            console.log("UO")
            res.json({ transactionHash });
        } else {
            res.status(404).json({ error: "No transaction found." });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
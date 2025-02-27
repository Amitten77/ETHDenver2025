require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const { connectToDb, getDb } = require("./db");
//init app and middleware
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3536;

let db;
connectToDb((err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log(`app listening on port ${PORT}`);
    });
    db = getDb();
  }
});


// Route to handle data insertion
app.post("/add_model_data", async (req, res) => {
  try {
    console.log("Recieved Request: ", req.body);
    const { accuracy, model, benchmark, confusion_matrix, transactionHash } = req.body;

    console.log(typeof accuracy, typeof model, typeof benchmark, typeof confusion_matrix);

    // Validate request body
    if (
      typeof accuracy !== "number" ||
      typeof model !== "string" ||
      typeof benchmark !== "string" ||
      typeof confusion_matrix !== "object"
    ) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Create the data object with timestamp
    const dataEntry = {
      accuracy,
      model,
      benchmark,
      confusion_matrix,
      transactionHash,
      entry_time: new Date(), // Current timestamp
    };

    // Insert into EigenGames2025.ModelData collection
    const result = await db
      .collection("ModelData")
      .insertOne(dataEntry);

    res.status(201).json({ message: "Data inserted successfully", id: result.insertedId });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/add_stake_data", async (req, res) => {
  try {
    console.log("Received Stake Data Request:", req.body);
    const { stakerAddress, operatorName, operatorAddress, amountStaked, yieldValue } = req.body;

    console.log(typeof stakerAddress, typeof operatorName, typeof operatorAddress, typeof amountStaked, typeof yieldValue);

    // Validate request body

    // Create the data object with entry_time as the current timestamp
    const stakeEntry = {
      stakerAddress,
      operatorName,
      operatorAddress,
      amountStaked,
      yield: yieldValue, // 'yield' is a reserved word in JS, so using yieldValue in req.body
      entry_time: new Date(), // Automatically generate the current timestamp
    };

    // Insert into EigenGames2025.StakeData collection
    const result = await db.collection("StakeData").insertOne(stakeEntry);

    res.status(201).json({ message: "Stake data inserted successfully", id: result.insertedId });
  } catch (error) {
    console.error("Error inserting stake data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetches all the model data for the ModelData database
app.get("/modeldata", async (req, res) => {
  console.log("Fetching model data");
  try {
    const collection = db.collection("ModelData");
    // Find all items, sort them by createdAt in descending order (-1), and limit to 10
    const items = await collection.find({}).toArray();

    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).send("Error fetching recent items");
  }
});

app.get("/stake_data/:stakerAddress", async (req, res) => {
  try {
    const { stakerAddress } = req.params;

    // Validate the input
    if (typeof stakerAddress !== "string" || !stakerAddress.startsWith("0x")) {
      return res.status(400).json({ error: "Invalid stakerAddress format" });
    }

    // Search for the entry in the StakeData collection
    const stakeEntry = await db.collection("StakeData").findOne({ stakerAddress });

    if (!stakeEntry) {
      return res.status(404).json({ error: "Stake data not found" });
    }

    res.status(200).json(stakeEntry);
  } catch (error) {
    console.error("Error fetching stake data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});





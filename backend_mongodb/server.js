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

// Health check endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});





require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");
//init app and middleware
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3001;

let db;
connectToDb((err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log(`app listening on port ${PORT}`);
    });
    db = getDb();
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

app.get("/user/:address", async (req, res) => {
  try {
    let address = req.params.address;
    const collection = db.collection("Users");
    const findResult = await collection.findOne({ address: address });
    if (findResult) {
      res.status(200).json(findResult);
    } else {
      res.status(200).json({});
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/user", async (req, res) => {
  const userData = req.body;
  try {
    const collection = db.collection("Users");
    const insertResult = await collection.insertOne(userData);
    res.status(201).json(insertResult);
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).send("Error inserting user into database");
  }
});

app.get("/questions", async (req, res) => {
  console.log("Fetching questions");
  try {
    const collection = db.collection("Questions");
    // Find all items, sort them by createdAt in descending order (-1), and limit to 10
    const items = await collection.find({}).sort({ date: -1 }).toArray();

    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).send("Error fetching recent items");
  }
});

app.get("/questions/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const collection = db.collection("Questions");
    // Find all items, sort them by createdAt in descending order (-1), and limit to 10
    const findResult = await collection.findOne({ _id: new ObjectId(id) });
    if (findResult) {
      res.status(200).json(findResult);
    } else {
      res.status(200).json({});
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/questions", async (req, res) => {
  const userData = req.body;
  userData.date = new Date();
  try {
    const collection = db.collection("Questions");
    const insertResult = await collection.insertOne(userData);
    res.status(201).json(insertResult);
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).send("Error inserting user into database");
  }
});

app.patch("/questions/:id/comment", async (req, res) => {
  const questionId = req.params.id;
  const comment = req.body; // Assuming the new comment comes in the body

  if (!comment) {
    return res.status(400).send("Comment data is required");
  }

  try {
    const collection = db.collection("Questions");
    // Update the question by pushing a new comment into its comments array
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(questionId) },
      { $push: { comments: comment } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).send("Question not found");
    }

    res.status(200).json(updateResult);
  } catch (err) {
    console.error("Error updating question with new comment:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/questions/:id/comments", async (req, res) => {
  try {
    const questionId = req.params.id;
    const collection = db.collection("Questions");

    // Assuming each question document has a 'comments' array field
    const question = await collection.findOne(
      { _id: new ObjectId(questionId) },
      { projection: { comments: 1 } }
    );

    if (question) {
      // Successfully found the question and its comments
      res.status(200).json(question.comments || []);
    } else {
      // No question found with the given ID
      res.status(404).send("Question not found");
    }
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/profileQuestionsTrue/:user", async (req, res) => {
  const userId = req.params.user;
  try {
    const collection = db.collection("Questions"); // Replace with your collection name
    const query = { address: userId, done: true };
    const documents = await collection.find(query).toArray();

    res.json(documents);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/profileQuestionsFalse/:user", async (req, res) => {
  const userId = req.params.user;
  try {
    const collection = db.collection("Questions"); // Replace with your collection name
    const query = { address: userId, done: false };
    const documents = await collection.find(query).toArray();

    res.json(documents);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/profileAnswersTrue/:user", async (req, res) => {
  const userId = req.params.user;
  try {
    const collection = db.collection("Questions"); // Replace with your collection name
    const query = { selected: userId, done: true }; // Note the use of dot notation for nested documents
    const documents = await collection.find(query).toArray();
    res.json(documents);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/profileAnswersFalse/:user", async (req, res) => {
  const userId = req.params.user;

  try {
    const collection = db.collection("Questions"); // Replace with your collection name
    const query = { selected: userId, done: false }; // Note the use of dot notation for nested documents
    const documents = await collection.find(query).toArray();
    res.json(documents);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.patch("/updateUser", async (req, res) => {
  const { name, address, image, bio } = req.body;
  const updateData = {
    name: name,
    address: address,
    image: image,
    rep: 0,
    bio: bio,
  };

  try {
    const collection = db.collection("Users"); // Replace with your collection name
    const filter = { address: address };
    const update = { $set: updateData };
    const result = await collection.updateOne(filter, update);

    if (result.matchedCount === 0) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User updated successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.patch("/questions/:id", async (req, res) => {
  try {
    // Connect to the MongoDB client
    const collection = db.collection("Questions");

    const { id } = req.params;
    const update = req.body;

    // Convert id from string to ObjectId
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: update,
    };

    // Update the question document
    const result = await collection.findOneAndUpdate(filter, updateDoc, {
      returnDocument: "after",
    });

    res.json(result.value);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.patch("/users/:address", async (req, res) => {
  try {
    // Connect to the MongoDB client
    const collection = db.collection("Users");

    const { address } = req.params;
    const update = req.body;

    // Convert id from string to ObjectId
    const filter = { address: address };
    const updateDoc = {
      $set: update,
    };

    // Update the question document
    const result = await collection.findOneAndUpdate(filter, updateDoc, {
      returnDocument: "after",
    });

    res.json(result.value);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

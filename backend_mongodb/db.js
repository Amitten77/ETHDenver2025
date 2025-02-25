const { MongoClient } = require("mongodb");
let dbConnection;
let uri = `mongodb+srv://dylsub:${process.env.URI_PASSWORD}@cluster0.pf8wm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri, { dbName: "ETHDENVER2025" })
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};

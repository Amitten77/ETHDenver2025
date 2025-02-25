axios = require('axios');


async function getAccuracy(model, benchmark) {
  try {
    const response = await axios.get("http://host.docker.internal:5179/get_benchmark", {
      params: { model, benchmark },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve accuracy");
    }

    return {
      accuracy: response.data.accuracy,
      confusion_matrix: response.data.confusion_matrix,
    };
  } catch (error) {
    console.error("Error fetching benchmark data:", error);
    return { error: "Failed to retrieve accuracy" };
  }
}
  
module.exports = {
  getAccuracy,
}
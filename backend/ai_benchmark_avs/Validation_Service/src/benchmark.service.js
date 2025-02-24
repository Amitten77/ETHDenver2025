axios = require('axios');


async function getAccuracy(query) {
  try {
    const response = await axios.get(`http://host.docker.internal:5179/get_benchmark`, {
      params: { query }
    });
    
    return {
      accuracy: response.data.accuracy
    };

  } catch (error) {
    console.error("Error fetching benchmark data:", error);
    return { error: "Failed to retrieve accuracy" };
  }
}
  
module.exports = {
  getAccuracy,
}
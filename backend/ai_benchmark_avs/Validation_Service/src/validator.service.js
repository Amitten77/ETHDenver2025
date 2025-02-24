require('dotenv').config();
const dalService = require("./dal.service");
const benchmarkService = require("./benchmark.service");



const ERROR_MARGIN = 0.10;


async function validate(proofOfTask) {

  try {
      const taskResult = await dalService.getIPfsTask(proofOfTask);
      var data = await benchmarkService.getAccuracy("sentiment");
      const upperBound = data.accuracy * (1 + ERROR_MARGIN);
      const lowerBound = data.accuracy * (1 - ERROR_MARGIN);
      let isApproved = true;
      if (taskResult.accuracy > upperBound || taskResult.accuracy < lowerBound) {
        isApproved = false;
      }
      return isApproved;
    } catch (err) {
      console.error(err?.message);
      return false;
    }
  }
  
  module.exports = {
    validate,
  }
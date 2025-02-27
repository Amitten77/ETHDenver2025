"use strict";
const { Router } = require("express")
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const benchmarkService = require("./benchmark.service");
const dalService = require("./dal.service");

const router = Router()

router.post("/execute", async (req, res) => {
    console.log("Executing task");

    try {
        var taskDefinitionId = Number(req.body.taskDefinitionId) || 0;

        var model = req.body.model;
        var benchmark = req.body.benchmark;

        console.log(`model: ${model}`);
        console.log(`benchmark: ${benchmark}`);

        console.log(`taskDefinitionId: ${taskDefinitionId}`);

        const result = await benchmarkService.getAccuracy(model, benchmark);
        const cid = await dalService.publishJSONToIpfs(result);
        const data = {
            "id": result.id,
            "accuracy": result.accuracy,
            "confusion_matrix": result.confusion_matrix,
            "model": model,
            "benchmark": benchmark
        };
        var dataString = JSON.stringify(data);
        await dalService.sendTask(cid, dataString, taskDefinitionId);
        return res.status(200).send(new CustomResponse({proofOfTask: cid, data: dataString, taskDefinitionId: taskDefinitionId}, "Task executed successfully"));
    } catch (error) {
        console.log(error)
        return res.status(500).send(new CustomError("Something went wrong", {}));
    }
})


module.exports = router

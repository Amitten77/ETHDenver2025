"use strict";
const { Router } = require("express")
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const validatorService = require("./validator.service");

const router = Router()

router.post("/validate", async (req, res) => {
    console.log("VALIDATE YO")
    var proofOfTask = req.body.proofOfTask;
    var hexString = req.body.data;
    // convert data back to json
    console.log("VALIDATOR DATA", hexString)

    // Remove the "0x" prefix (if present)
    const cleanedHex = hexString.startsWith("0x") ? hexString.slice(2) : hexString;

    // Convert hex to a readable string
    const decodedText = Buffer.from(cleanedHex, "hex").toString("utf8");

    console.log("DECODED TEXT", decodedText)


    var data = JSON.parse(decodedText);
    console.log("DATA AFTER PARSE", data)
    var model = data.model;
    var benchmark = data.benchmark;
    console.log(`Validate task: proof of task: ${proofOfTask}`);
    try {
        const result = await validatorService.validate(proofOfTask, model, benchmark);
        console.log('Vote:', result ? 'Approve' : 'Not Approved');
        return res.status(200).send(new CustomResponse(result));
    } catch (error) {
        console.log(error)
        return res.status(500).send(new CustomError("Something went wrong", {}));
    }
})

module.exports = router

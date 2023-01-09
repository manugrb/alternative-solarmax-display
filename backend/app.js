const express = require("express");
const cors = require("cors");
const inverterInterface = require("./inverterInterface");
const {prepareForTracking, startAllIntervals} = require("./backgroundDataTracker.js");

const app = express();
const PORT = 3001;

app.use(
    cors({
        origin: "*"
    })
);

app.listen(PORT, () => {
    console.log("it's alive on http://localhost:" + PORT);
})

app.get('/general', (req, res) => {
    
    inverterInterface.getInverterJson().then((value) => {
        res.status(200).send(value);
    })

});

prepareForTracking().then(() => {
    startAllIntervals();
}, (reason) => {
    console.error(reason);
})
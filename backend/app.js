import express from "express";
import cors from "cors";
import getInverterJson from "./inverterInterface.js";
const app = express();
const PORT = 3001;

app.use(
    cors({
        origin: "*"
    })
)

app.listen(PORT, () => {
    console.log("it's alive on http://localhost:" + PORT);
})

app.get('/general', (req, res) => {
    
    getInverterJson().then((value) => {
        res.status(200).send(value);
    })

});
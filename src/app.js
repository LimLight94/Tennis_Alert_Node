"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tennis_model_1 = require("./tennis.model");
const db_1 = __importDefault(require("./db"));
const app = (0, express_1.default)();
const port = 3000;
const dbAddress = "mongodb://localhost:27017/tennis";
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get("/courts", (req, res) => {
    tennis_model_1.Tennis.find()
        .then((tennis) => {
        if (!tennis.length)
            return res.status(404).send({ err: 'Court not found' });
        res.send(tennis);
    })
        .catch((err) => res.status(500).send(err));
});
app.post("/courts", (req, res) => {
    let reqBody = req.body;
    tennis_model_1.Tennis.findOneAndUpdate({ name: reqBody.name }, reqBody, { new: true, upsert: true })
        .then((tennis) => res.send(tennis)).catch((err) => res.status(500).send(err));
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
(0, db_1.default)(dbAddress);

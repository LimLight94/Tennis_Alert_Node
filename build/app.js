"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tennis_model_1 = require("./tennis.model");
const db_1 = __importDefault(require("./db"));
const slack_1 = require("./slack");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = process.env.port || 3000;
const dbAddress = "mongodb://localhost:27017/tennis";
const cors = require('cors');
let corsOptions = {
    origin: "*",
    credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express_1.default.static(path_1.default.join(__dirname, '../src/client/build')));
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../src/client/build/index.html'));
});
app.get("/alert", (req, res) => {
    const baseUrl = `${req.protocol}://${req.hostname}:${port}`;
    tennis_model_1.Tennis.find().then((courts) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, slack_1.sendBotMsg)(baseUrl, courts);
        res.status(200).send("OK");
    })).catch((err) => res.status(500).send(err));
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

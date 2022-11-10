import express, {Request, Response} from "express";
import {Tennis, DateAndTime, ITennis} from "./tennis.model"
import connect from "./db"
import {sendBotMsg} from "./slack";
import path from "path";

const app = express()
const port = process.env.port || 3000
const dbAddress = "mongodb://localhost:27017/tennis"
const cors = require('cors');
let corsOptions = {
    origin: "*", // 출처 허용 옵션
    credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'client/build')));

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.get("/alert", (req: Request, res: Response) => {
    const baseUrl = `${req.protocol}://${req.hostname}:${port}`
    Tennis.find().then(async (courts: any) => {
        await sendBotMsg(baseUrl, courts)
        res.status(200).send("OK")
    }).catch((err: any) => res.status(500).send(err));
});

app.get("/courts", (req: Request, res: Response) => {
    Tennis.find()
        .then((tennis: any) => {
            if (!tennis.length) return res.status(404).send({err: 'Court not found'});
            res.send(tennis);
        })
        .catch((err: any) => res.status(500).send(err));
});

app.post("/courts", (req: Request, res: Response) => {
    let reqBody: ITennis = req.body
    Tennis.findOneAndUpdate({name: reqBody.name}, reqBody, {new: true, upsert: true})
        .then(
            (tennis: any) => res.send(tennis)
        ).catch((err: any) => res.status(500).send(err));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
connect(dbAddress)
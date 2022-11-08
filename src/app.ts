import express, {Request, Response} from "express";
import {Tennis, DateAndTime, ITennis} from "./tennis.model"
import connect from "./db"

const app = express()
const port = process.env.port || 3000
const dbAddress = "mongodb://localhost:27017/tennis"

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.get("/courts", (req: Request, res: Response) => {
    Tennis.find()
        .then((tennis:any) => {
            if (!tennis.length) return res.status(404).send({err: 'Court not found'});
            res.send(tennis);
        })
        .catch((err:any) => res.status(500).send(err));
});

app.post("/courts", (req: Request, res: Response) => {
    let reqBody: ITennis = req.body
    Tennis.findOneAndUpdate({name: reqBody.name}, reqBody, {new: true, upsert: true})
        .then(
            (tennis:any) => res.send(tennis)
        ).catch((err:any) => res.status(500).send(err));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
connect(dbAddress)
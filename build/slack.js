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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBotMsg = void 0;
const { WebClient, LogLevel } = require("@slack/web-api");
const SLACK_API_TOKEN = "xoxb-4366820225681-4366847516641-WRqUZEY1hVyNBoXC6IhulP5Z";
const client = new WebClient(SLACK_API_TOKEN, {
    logLevel: LogLevel.DEBUG
});
const msgBlock = [];
const makeLinkButton = (link) => {
    console.log("test" + link);
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "<" + link + "|:Tennis:전체목록 보러가기>"
        }
    };
};
const makeCourtNameSection = (courtName) => {
    return {
        "type": "section",
        "text": {
            "type": "plain_text",
            "text": courtName,
            "emoji": true
        }
    };
};
const makeCourtDateAndTime = (dateAndTime) => {
    let result = dateAndTime.map(item => {
        let result = `${item.date}\n${item.time}`;
        return {
            "type": "section",
            "text": {
                "type": "plain_text",
                "text": result,
                "emoji": true
            }
        };
    });
    let divider = { "type": "divider" };
    result.push(divider);
    return result;
};
const sendBotMsg = (baseUrl, courts) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        msgBlock.push(makeLinkButton(baseUrl));
        courts.forEach((item, index) => {
            msgBlock.push(makeCourtNameSection(item.name));
            msgBlock.push(...makeCourtDateAndTime(item.dateAndTime));
        });
        const result = yield client.chat.postMessage({
            channel: "#alert",
            blocks: msgBlock
        });
        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
});
exports.sendBotMsg = sendBotMsg;

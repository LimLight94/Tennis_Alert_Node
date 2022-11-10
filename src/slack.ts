const {WebClient, LogLevel} = require("@slack/web-api");

const SLACK_API_TOKEN = "Require API Token";
const client = new WebClient(SLACK_API_TOKEN, {
    logLevel: LogLevel.DEBUG
});

const msgBlock: any[] = [];

const makeLinkButton = (link: string) => {
    console.log("test" + link)
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "<" + link + "|:Tennis:전체목록 보러가기>"
        }
    }
}

const makeCourtNameSection = (courtName: string) => {
    return {
        "type": "section",
        "text": {
            "type": "plain_text",
            "text": courtName,
            "emoji": true
        }
    }
}

const makeCourtDateAndTime = (dateAndTime: Array<any>) => {
    let result = dateAndTime.map(item => {
        let result = `${item.date}\n${item.time}`
        return {
            "type": "section",
            "text": {
                "type": "plain_text",
                "text": result,
                "emoji": true
            }
        }
    })
    let divider: any = {"type": "divider"}
    result.push(divider)
    return result
}


export const sendBotMsg = async (baseUrl: string, courts: any) => {
    try {
        msgBlock.push(makeLinkButton(baseUrl))
        courts.forEach((item: any, index: number) => {
            msgBlock.push(makeCourtNameSection(item.name))
            msgBlock.push(...makeCourtDateAndTime(item.dateAndTime))
        })
        const result = await client.chat.postMessage({
            channel: "#alert",
            blocks: msgBlock.slice(0,49)
        });

        console.log(result);
    } catch (error) {
        console.error(error);
    }
}
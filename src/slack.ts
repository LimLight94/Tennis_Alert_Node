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
        let filterTimes = item.time.filter((timeItem: String) => {
            return "18:00" <= timeItem.split("~")[0]
        })
        if (filterTimes.length == 0) {
            return [];
        }
        let result = `${item.date}\n${filterTimes}`
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
        courts.forEach((item: any, index: number) => {
            let nameBlock = makeCourtNameSection(item.name)
            let dateAndTimeBlocks = []
            dateAndTimeBlocks.push(...makeCourtDateAndTime(item.dateAndTime))
            if (dateAndTimeBlocks.length == 0) {
                return;
            } else {
                msgBlock.push(makeLinkButton(baseUrl))
                msgBlock.push(nameBlock)
                msgBlock.push(...dateAndTimeBlocks)
            }
        })
        if (msgBlock.length <= 1) {
            return;
        }
        const result = await client.chat.postMessage({
            channel: "#alert",
            blocks: msgBlock.slice(0, 49)
        });

        console.log(result);
    } catch (error) {
        console.error(error);
    }
}
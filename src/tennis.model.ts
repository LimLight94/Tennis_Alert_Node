import {Schema, model} from "mongoose";

const dateAndTimeSchema: Schema = new Schema<IDateAndTime>({
    date: {type: String, required: true},
    time: {type: [String], required: false},
});

const tennisSchema: Schema = new Schema<ITennis>({
    name: {type: String, required: true, unique: true},
    orgLink: {type: String, required: false},
    dateAndTime: [dateAndTimeSchema]
});

export interface ITennis {
    name: string,
    orgLink: string,
    dateAndTime: IDateAndTime[]
}

export interface IDateAndTime {
    date: string,
    time: string[]
}

export const DateAndTime = model<IDateAndTime>("DateAndTime", dateAndTimeSchema)
export const Tennis = model<ITennis>("Tennis", tennisSchema)

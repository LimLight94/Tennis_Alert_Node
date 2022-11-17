"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tennis = exports.DateAndTime = void 0;
const mongoose_1 = require("mongoose");
const dateAndTimeSchema = new mongoose_1.Schema({
    date: { type: String, required: true },
    time: { type: [String], required: false },
}, { id: false });
const tennisSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    orgLink: { type: String, required: false },
    dateAndTime: [dateAndTimeSchema]
}, { versionKey: false, timestamps: true });
exports.DateAndTime = (0, mongoose_1.model)("DateAndTime", dateAndTimeSchema);
exports.Tennis = (0, mongoose_1.model)("Tennis", tennisSchema);

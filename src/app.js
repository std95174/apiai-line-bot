'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const LineBot = require('./linebot');
const LineBotConfig = require('./linebotconfig');

const REST_PORT = (process.env.PORT || 5000);
const DEV_CONFIG = process.env.DEVELOPMENT_CONFIG == 'true';

const APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_TOKEN;
const APIAI_LANG = process.env.APIAI_LANG;

const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const LINE_MID = process.env.LINE_MID;

// console timestamps
require('console-stamp')(console, 'yyyy.mm.dd HH:MM:ss.l');

const botConfig = new LineBotConfig(APIAI_ACCESS_TOKEN, APIAI_LANG,
    LINE_CHANNEL_ID,
    LINE_CHANNEL_SECRET,
    LINE_MID);

const bot = new LineBot(botConfig);

const app = express();

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {

    console.log('POST received');

    // TODO Add signature verification

    try {

        if (req.body.result) {
            req.body.result.forEach(function (item) {
                bot.processMessage(item, res);
            });
        }

    } catch (err) {
        return res.status(400).send('Error while processing ' + err.message);
    }
});

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});
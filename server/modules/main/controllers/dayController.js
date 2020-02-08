"use strict";
const events = require('events');
const eventEmitter = new events.EventEmitter();
const PassThrough = require('stream').PassThrough;

let dayModel = require('../models/dayModel')
let userModel = require('../models/userModel')

let DbDate = require('../../../DbDate').DbDate;

exports.setDayShifts = async function setDayShifts(roomID, userID, date, shifts) {
    let isSuccessful = false;

    if (!(date instanceof DbDate)) {
        throw new Error("Invalid date (" + typeof(date) + ")")
    }
    
    if (await userModel.hasAccessToRoom(userID, roomID)) {
        isSuccessful = await dayModel.setShifts(roomID, userID, date, shifts)
    }

    if (isSuccessful) {
        eventEmitter.emit("userDataUpdated", roomID, userID);
    }

    return isSuccessful;
}

/*exports.subscribeToEvents = function subscribeToEvents(ctx) {
    return new Promise((resolve, reject) => {
        const stream = new PassThrough();

        // const sse = (event, data) => {
        //     return "data:" + encodeURIComponent(JSON.stringify({"status": "ok"})) + "\n\n"
        // }

        // ctx.req.on('close', ctx.res.end);
        // ctx.req.on('finish', ctx.res.end);
        // ctx.req.on('error', ctx.res.end);
        
        // eventEmitter.addListener("userDataUpdated", (e) => {
        //     console.log("userDataUpdated");
        //     stream.write("userDataUpdated");
        // });

        ctx.body = stream;
        
        setInterval(() => {
            console.log("write");
            stream.push("data:" + encodeURIComponent(JSON.stringify({"status": "ok"})) + "\n\n");
        }, 5000);
        
        // ctx.body = stream;
        // ctx.body.pipe(stream);
        // stream.pipe(ctx.body);
    });
}

var Transform = require('stream').Transform;
var inherits = require('util').inherits;

inherits(SSE, Transform);

function SSE(options) {
  if (!(this instanceof SSE)) return new SSE(options);

  options = options || {};
  Transform.call(this, options);
}

SSE.prototype._transform = function(data, enc, cb) {
  this.push('data: ' + data.toString('utf8') + '\n\n');
  cb();
};*/
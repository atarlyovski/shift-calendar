var moment = require('moment');

var userModel = require('./modules/main/models/userModel');

async function flushOldShiftsPeriodically(interval = 2147483647) {
    const flush = () => {
        let now = moment();

        userModel.deleteShiftsOlderThan(now.subtract(2, "months").valueOf());
    }

    flush();

    return setInterval(() => {
        try {
            flush();
        } catch (err) {
            displayError(err);
        }
    }, interval);
}

module.exports = {
    flushOldShiftsPeriodically
}
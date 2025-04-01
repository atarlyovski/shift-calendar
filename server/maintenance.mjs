import moment from 'moment';
import userModel from './modules/main/models/userModel.mjs';

async function flushPeriodically(flushFunction, interval = 2147483647) { // default: 24 hours
    const flush = async () => {
        try {
            await flushFunction();
        } catch (err) {
            displayError(err);
        }
    };

    await flush();

    return setInterval(flush, interval);
}

async function flushOldShifts() {
    const now = moment();
    await userModel.deleteShiftsOlderThan(now.subtract(2, "months").valueOf());
}

async function flushOldUnsuccessfulLogins() {
    const now = moment();
    await userModel.deleteUnsuccessfulLoginAttemptsOlderThan(now.subtract(1, "day").valueOf());
}

async function flushOldSessions() {
    await userModel.deleteExpiredSessions();
}

function startMaintenanceTasks() {
    flushPeriodically(flushOldShifts);
    flushPeriodically(flushOldUnsuccessfulLogins);
    flushPeriodically(flushOldSessions);
}

export default {
    startMaintenanceTasks
};
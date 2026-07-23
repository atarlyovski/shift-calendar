"use strict";
import { Client } from 'ssh2';
import cron from 'cron';
import fs from 'fs';

import userModel from '../models/userModel.mjs';

const userId = 1;

const checkIfUserIsHome = async() => {
    return new Promise((resolve, reject) => {
        const targetIp = '192.168.6.99';
        const interfaceName = process.env.ROUTER_ARPING_IFACE || 'eth0';
        const reportError = typeof displayError === 'function'
            ? displayError
            : err => console.error(err);
        const conn = new Client();

        conn.on('error', err => {
            reject(err);
        });
        conn.on('ready', () => {
            const command = `arping -c 1 -W 1 -I ${interfaceName} ${targetIp}`;
            conn.exec(command, (err, stream) => {
                if (err) {
                    conn.end();
                    reject(err);
                    return;
                }

                let output = '';
                stream.on('close', (code) => {
                    conn.end();
                    resolve(code === 0);
                }).on('data', (data) => {
                    output += data.toString();
                }).stderr.on('data', (data) => {
                    reportError('STDERR: ' + data);
                    conn.end();
                    reject(new Error('Error while executing command'));
                });
            });
        }).connect({
            host: process.env.ROUTER_IP || '192.168.1.1',
            port: process.env.ROUTER_SSH_PORT || 22,
            username: process.env.ROUTER_USERNAME || 'admin',
            privateKey: fs.readFileSync('./asus_ssh_keygen_key')
        });
    });
}

const setScheduledHomeCheck = async() => {
    const cronStrings = [
        "*/15 7-18 * * *",
        "5/30 6,18-23 * * *"
    ];

    cronStrings.forEach(cronString => {
        const cronJob = new cron.CronJob(cronString, async() => {
            try {
                const isHome = await checkIfUserIsHome();
                await userModel.setIsHome(userId, isHome);
            } catch (err) {
                displayError(err);
            }
        });

        cronJob.start();
    });
}

export default { 
    checkIfUserIsHome,
    setScheduledHomeCheck
}
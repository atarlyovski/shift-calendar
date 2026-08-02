"use strict";
import { Client } from 'ssh2';
import cron from 'cron';
import fs from 'fs';
import { exec } from 'child_process';
import os from 'os';

import userModel from '../models/userModel.mjs';

const userId = 1;
const targetIp = '192.168.6.99';

const checkIfUserIsHome = async() => {
    return new Promise((resolve) => {
        const platform = os.platform();
        const pingCommand = platform === 'win32' 
            ? `ping -n 1 -w 1000 ${targetIp}`
            : `ping -c 1 -W 1 ${targetIp}`;
        
        exec(pingCommand, (error) => {
            if (error) {
                displayError(`Error executing ping command: ${error.message}`);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * Checks if the user is home by executing the 'arp -a' command on the router via SSH.
 * Note: This has shown to be unreliable due to the arp cache not always being updated in time. Use with caution.
 * @returns Promise
 */
const checkIfUserIsHomeArp = async() => {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        conn.on('error', err => {
            reject(err);
        });
        conn.on('ready', () => {
            conn.exec('arp -a', (err, stream) => {
                if (err) throw err;
                let output = '';
                stream.on('close', () => {
                    const lines = output.split('\n');
                    const targetLine = lines.find(line => line.includes(targetIp));
                    conn.end();

                    if (targetLine && !targetLine.includes('<incomplete>')) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }).on('data', (data) => {
                    output += data.toString();
                }).stderr.on('data', (data) => {
                    displayError('STDERR: ' + data);
                    conn.end();
                    reject("Error while executing command");
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
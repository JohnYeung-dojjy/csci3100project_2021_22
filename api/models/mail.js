const express = require("express");
const nodemailer = require('nodemailer');
async function mailing(obj, option) {
    if (option === 0) {
        try {
            const serveremail = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '3100projhole@gmail.com',
                    pass: 'holeinthewall'
                }
            })
            let congratulations = {
                from: 'HoleInTheWall-Official',
                to: obj.user_email,
                subject: 'Congratulations!',
                html: '<b>' + 'Dear ' + obj.username + ',</b><br/><br/>&emsp;&emsp;You have successfully completed the registration and become our member!'
            }
            serveremail.sendMail(congratulations, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } catch (e) {
            console.log(e.message);
            return -1;
        }
    }
}
module.exports = { mailing };
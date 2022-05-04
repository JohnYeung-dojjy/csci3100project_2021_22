const nodemailer = require('nodemailer');

async function mailing(obj, option) {
    if (option === 0) {
        try {
            // setting server email
            const serveremail = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '3100projhole@gmail.com',
                    pass: 'holeinthewall'
                }
            })
            // input email details
            let congratulations = {
                from: 'HoleInTheWall-Official',
                to: obj.user_email,
                subject: 'Congratulations!',
                html: '<b>' + 'Dear ' + obj.username + ',</b><br/><br/>&emsp;&emsp;You have successfully completed the registration and become our member!'
            }
            // sending email
            serveremail.sendMail(congratulations, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            return 0;
        } catch (e) {
            console.log(e.message);
            return -1;
        }
    }
}

async function reset(obj, option) {
    if (option === 0) {
        try {
            // setting server email
            const serveremail = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '3100projhole@gmail.com',
                    pass: 'holeinthewall'
                }
            })
            // input email details
            let congratulations = {
                from: 'HoleInTheWall-Official',
                to: obj.user_email,
                subject: 'Your password has been reset',
                html: '<b>' + 'Dear ' + obj.username + ',</b><br/><br/>&emsp;&emsp;Your password has been reset!!!' + '<br/><br/>Your default password now is { xxxx0000 }' + '<br/><br/>Please modify your password in your user page as soon as possible!'
            }
            // sending email
            serveremail.sendMail(congratulations, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            return 0;
        } catch (e) {
            console.log(e.message);
            return -1;
        }
    }
}
module.exports = { mailing, reset };
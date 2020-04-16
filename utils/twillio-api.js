// DANGER! This is insecure. See http://twil.io/secure
//const accountSid = 'AC262c70cd756e4f1e334495a4a4f34dce';
//const authToken = 'your_auth_token';
//const client = require('twilio')(accountSid, authToken);

// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'ACa6fda777a50942d69faaa5f36528630d';
const authToken = 'be6f6f239bc9df2e7d4b4690e51cdcb5';
const client = require('twilio')(accountSid, authToken);


let isSent = false;

var isEnabled = true;
const fromNumber = '+15017122661';
const toNumber = '+15558675310';

module.exports = {
    ApiAdaptor: {
        sendsms: function (message) {
            if (isEnabled) {
                console.log('Sending message:' + message);
                client.messages
                    .create({
                        body: message,
                        from: fromNumber,
                        to: toNumber
                    })
                    .then(message => function(){
                        console.log(message.sid);
                        isSent = true;
                        console.log('Message Sent!');
                    });
            } else {
                console.log('***Development mode*** ');
                console.log('Twillio Api: message ---> ' + message);
            }
        },
        enable: function () {
            isEnabled = true;
        },
        disable: function () {
            isEnabled = false;
        }
    }
}

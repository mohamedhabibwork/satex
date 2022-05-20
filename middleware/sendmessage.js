var FCM = require('fcm-node');
var Notification = require("../models/notification");
var serverKey = require("../sataexpress-86fce-firebase-adminsdk-tabfr-66c597cf46.json");
var fcm = new FCM(serverKey);

function sendmessage(token, title, body) {
    fcm.send({ //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,
        //collapse_key: 'your_collapse_key',

        notification: {
            title: title,
            body: body
        }
    }, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
            response.json({
                "error": err
            })
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

module.exports = sendmessage

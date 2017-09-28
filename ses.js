module.exports = function(RED) {
    "use strict";

    function AmazonSesNode(n) {
        RED.nodes.createNode(this,n);
        this.awsConfig = RED.nodes.getNode(n.aws);
        this.region = this.awsConfig.region;
        this.accessKey = this.awsConfig.accessKey;
        this.secretKey = this.awsConfig.secretKey;
        this.name= n.name;
        this.operation = n.operation;
        this.from = n.from;
        this.replyTo = n.replyTo;
        this.charset = n.charset;
        var node = this;

        var AWS = require("aws-sdk");
        AWS.config.update({
            accessKeyId: this.accessKey,
            secretAccessKey: this.secretKey,
            region: '' + this.region
        });
        var ses = new AWS.SES();
        
        node.on("input", function(msg) {

            node.sendMsg = function (err, data) {
              if (err) {
                node.status({fill:"red",shape:"ring",text:"error"});
                node.error("failed: " + err.toString() ,msg);
                return;
              } else {
                node.status({});
              }
              msg.payload = data;
              node.send(msg);
            };

            switch (node.operation) {

              case 'sendEmail':

                node.status({fill:"blue",shape:"dot",text:"sendEmail"});
                var params = {
                    Destination: {
                        ToAddresses: [ msg.topic ]
                    },
                    Message: {
                        Body: {
                            Text: {
                                Data: msg.body,
                                Charset: this.charset
                            }
                        },
                        Subject: {
                            Data: msg.subject,
                            Charset: this.charset
                        }
                    },
                    ReturnPath: msg.replyTo? msg.replyTo : this.replyTo,
                    Source: msg.from? msg.from : this.from
                };
                ses.sendEmail(params, node.sendMsg);
                break;
            }
        });
    }
    RED.nodes.registerType("amazon ses", AmazonSesNode);
};
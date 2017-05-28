module.exports = function(RED) {
    "use strict";

    function AmazonCognitoQueryNode(n) {
        RED.nodes.createNode(this,n);
        this.awsConfig = RED.nodes.getNode(n.aws);
        this.region = this.awsConfig.region;
        this.accessKey = this.awsConfig.accessKey;
        this.secretKey = this.awsConfig.secretKey;
        this.userPoolId = this.awsConfig.userPoolId;
        this.operation = n.operation;
        this.name= n.name;

        var node = this;
        var AWS = require("aws-sdk");

        AWS.config.update({
            accessKeyId: this.accessKey,
            secretAccessKey: this.secretKey,
            region: this.region
        });

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});
        
        node.on("input", function(msg) {

            node.sendMsg = function (err, data) {
              if (err) {
                node.status({fill:"red",shape:"ring",text:"error"});
                node.error("failed: " + err.toString() ,msg);
                console.log(err);
                return;
              } else {
                node.status({});
                console.log(data);
              }
              msg.payload = data;
              node.send(msg);
            };

            switch (node.operation) {

              case 'listUsers':

                node.status({fill:"blue",shape:"dot",text:"listUsers"});
                var params = {
                    UserPoolId: '' + this.userPoolId,
                    AttributesToGet: [],
                    Limit: 60
                };
                cognitoidentityserviceprovider.listUsers(params, node.sendMsg);

                break;
            
              case 'adminGetUser':

                node.status({fill:"blue",shape:"dot",text:"adminGetUser"});

                if (typeof msg.j === "undefined") var idx = 0;
                else var idx = msg.j;

                var params = {
                    UserPoolId: '' + this.userPoolId,
                    Username: '' + msg.users.Users[idx].Username
                };
                cognitoidentityserviceprovider.adminGetUser(params, node.sendMsg);

                break;

            }
        });
    }
    RED.nodes.registerType("amazon cognito", AmazonCognitoQueryNode);
};
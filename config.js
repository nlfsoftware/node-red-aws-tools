module.exports = function(RED) {

    function RemoteServerNode(n) {
        RED.nodes.createNode(this,n);
        this.accessKey = this.credentials.accessKey;
        this.secretKey = this.credentials.secretKey;
        this.userPoolId = this.credentials.userPoolId;
        this.region = n.region;
        this.name = n.name;
    }
    RED.nodes.registerType("config",RemoteServerNode,{
        credentials: {
            accessKey: {type:"text"},
            secretKey: {type:"text"},
            userPoolId: {type:"text"}
        }
    });
}
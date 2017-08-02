module.exports = function (RED) {
  var firebase = require('firebase');
  var Utils = require('./utils/utils');
  var _ = require('lodash-node');

  function FirebasePush(n) {
    RED.nodes.createNode(this, n);
    this.firebaseConfig = RED.nodes.getNode(n.firebaseConfig);
    this.childpath = n.childpath;
    this.activeRequests = [];
    this.ready = false;
    var node = this;
    
    if (!this.firebaseConfig) {
      this.status({ fill: "red", shape: "ring", text: "invalid credentials" })
      this.error('You need to setup Firebase credentials!');
      return;
    }

    this.status({ fill: "green", shape: "ring", text: "Connected" });
    this.on('input', function (msg) {
      if (this.firebaseConfig.fbConfig.fbApp) {
		var ref = firebase.database().ref(this.childpath);
        ref.push(msg.payload);
        this.log ("Payload: \n" + this.childpath + "\n" + JSON.stringify(msg.payload, null, 2));

        node.status({ fill: "green", shape: "ring", text: "Pushed Data at " + Utils.getTime() });
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType('shri.firebase.push', FirebasePush);
};

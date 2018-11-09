/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
const net = require("net");

class TcpServer {
  /**
   * Private function to init the events given in the constructor
   *
   * @param {object} config must have an attribut `TCP_PORT_LISTEN`
   * @param {onConnectCallback} onConnect callback called on new incoming client
   * @param {onDataCallback} onData callback called on incoming data from clients
   * @param {onCloseCallback} onClose callback called when a client disconnect
   */
  constructor(config, onConnect, onData, onClose) {
    this.port = config.TCP_PORT_LISTEN;
    this.server = net.createServer();

    this.server.listen(this.port);
    _initEvent.call(this, onConnect, onData, onClose);
  }
}

function _initEvent(onConnect, onData, onClose) {
  this.server.on("listening", () => {
    console.log("TCP Server is running on port " + this.port + ".");
  });

  this.server.on("error", e => {
    if (e.code === "EADDRINUSE") {
      console.log("Address in use, retrying...");
      setTimeout(() => {
        this.server.close();
        this.server.listen(this.port);
      }, 1000);
    }
  });

  this.server.on("connection", function(sock) {
    // set incoming data as utf8
    sock.setEncoding("utf8");

    // call the callback on connect
    onConnect(sock);

    sock.on("data", function(data) {
      // call the callback on incoming data
      onData(sock, data);
    });

    sock.on("close", function() {
      // call the callback client disconnect
      onClose(sock);
    });
  });
}

/**
 * callback called on new incoming client.
 * @callback onConnectCallback
 * @param {net.Socket} socket
 */
/**
 * callback called on incoming data from clients.
 * @callback onDataCallback
 * @param {net.Socket} socket
 * @param {String} data
 */
/**
 * callback called when a client disconnect.
 * @callback onCloseCallback
 * @param {net.Socket} socket
 */

module.exports = TcpServer;

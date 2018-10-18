const TcpServer = require("./TcpServer.js");
require("spinal-core-connectorjs");
const SpinalDevice = require("../models/SpinalDevice.js");

/**
 *
 * @class ServerProcess
 */
class ServerProcess {
  /**
   *Creates an instance of ServerProcess.
   * @param {object} config must have an attribut `TCP_PORT_LISTEN`
   * @param {Model} model
   * @memberof ServerProcess
   */
  constructor(config, model) {
    this.model = model;
    this.config = config;
    this.tcpServer = new TcpServer(
      config,
      this.onConnect.bind(this),
      this.onData.bind(this),
      this.onClose.bind(this)
    );
    this.bindedOnModelsChange = this.onModelsChange.bind(this);
    this.model.bind(this.bindedOnModelsChange);
  }

  /**
   * release the listenting
   * @memberof ServerProcess
   */
  release() {
    this.model.unbind(this.bindedOnModelsChange);
  }

  /**
   *
   *
   * @param {net.Socket} socket
   * @memberof ServerProcess
   */
  onConnect(socket) {
    if (this.config.DEBUG)
      console.log(
        "CONNECTED: " + socket.remoteAddress + ":" + socket.remotePort
      );
  }
  /**
   *
   *
   * @param {net.Socket} socket
   * @param {string} data
   * @memberof ServerProcess
   */
  onData(socket, data) {
    if (this.config.DEBUG)
      console.log("DATA " + socket.remoteAddress + ": " + data);
    this._parseIncomingTCPData(data);
  }
  /**
   *
   *
   * @param {net.Socket} socket
   * @memberof ServerProcess
   */
  onClose(socket) {
    if (this.config.DEBUG)
      console.log("CLOSED: " + socket.remoteAddress + " " + socket.remotePort);
  }

  /**
   * method called by spinalCore when some data are modified in the model
   *
   * @memberof ServerProcess
   */
  onModelsChange() {
    // incoming change in model
  }

  _parseIncomingTCPData(data) {
    try {
      const parsed = JSON.parse(data);
      let device = this._searchExistingDevice(parsed);
      if (device === null) {
        // create a model if it doesn't exist
        device = new SpinalDevice();
        this.model.push(device);
      }
      // update device
      device.update(parsed);

      // update endpoints of the device
    } catch (error) {
      console.error(error);
    }
  }

  _searchExistingDevice(json) {
    for (var i = 0; i < this.model.length; i++) {
      if (this.model[i].dp_bim_prefix.get() === json.dp_bim_prefix)
        return this.model[i];
    }
    return null;
  }
}

module.exports = ServerProcess;

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

const axios = require("axios");

const Q = require("q");
const spinalCore = require("spinal-core-connectorjs");

/**
 *
 * @module SpinalConnection
 * @class SpinalConnection
 */
class SpinalConnection {
  /**
   *Creates an instance of SpinalConnection.
   * @param {*} config
   * @memberof SpinalConnection
   */
  constructor(config) {
    this.models = {};
    this.spinalHost = config.SPINALHUB_IP;
    this.spinalPort = config.SPINALHUB_PORT;
    this.spinalUserName = config.SPINAL_USER_NAME;
    this.spinalPassword = config.SPINAL_PASSWORD;

    this.reconnectInterval = config.CONNECTION_SPINALHUB_INTERVAL;
    this.reconnectTimeout = config.CONNECTION_SPINALHUB_TIMEOUT;
    this.startConnection = null;
    this.initPromise = undefined;
  }

  /**
   * test the connection to the hub and then create a FileSystem instance
   *
   * @returns Promise
   * @memberof SpinalConnection
   */
  init() {
    if (typeof this.initPromise != "undefined") return this.initPromise;
    this.startConnection = Date.now();
    this.initPromise = _testConnectionLoop.call(this).then(
      id => {
        let option =
          "http://" +
          id +
          ":" +
          this.spinalPassword +
          "@" +
          this.spinalHost +
          ":" +
          this.spinalPort +
          "/";
        this.conn = spinalCore.connect(option);
        return this.conn;
      },
      err => {
        this.initPromise = undefined;
        throw err;
      }
    );
    return this.initPromise;
  }

  /**
   *
   *
   * @param {*} path
   * @param {*} ModelToStoreIfNotExist
   * @returns {Promise} resolve Model
   * @memberof SpinalConnection
   */
  loadOrStore(path, ModelToStoreIfNotExist) {
    if (typeof this.models[path] !== "undefined")
      return this.models[path].defer;
    const defer = (this.models[path] = Q.defer());

    spinalCore.load(
      this.conn,
      path,
      model => {
        // model already exist resolve promise
        defer.resolve(model);
      },
      () => {
        // model don't creating new "ModelToStoreIfNotExist"
        var model = new ModelToStoreIfNotExist();
        spinalCore.store(
          this.conn,
          model,
          path,
          () => {
            defer.resolve(model);
          },
          () => {
            defer.reject("Unable to store the model");
          }
        );
      }
    );
    return defer.promise;
  }
}

// private method to do a axios request
function _getUserID(user, password) {
  return axios({
    method: "get",
    url: "http://" + this.spinalHost + ":" + this.spinalPort + "/get_user_id",
    responseType: "text",
    params: { u: user, p: password }
  });
}

// warp a setTimeout in a promise
function _timeout_func(func, timeout) {
  var q = Q.defer();
  setTimeout(() => {
    func().then(q.resolve, q.reject);
  }, timeout);
  return q.promise;
}
function _testConnectionLoop() {
  if (
    this.reconnectTimeout != 0 &&
    this.startConnection + this.reconnectTimeout < Date.now()
  ) {
    return Q.reject("Connection Timeout");
  } else {
    return _getUserID.call(this, this.spinalUserName, this.spinalPassword).then(
      response => {
        let id = parseInt(response.data);
        if (id === -1) throw "Username / password doesn't match.";
        return id;
      },
      () => {
        let errorMessage = "connection failure trying to reconnect";
        console.error(errorMessage);
        return _timeout_func.call(
          this,
          _testConnectionLoop.bind(this),
          this.reconnectInterval
        );
      }
    );
  }
}

module.exports = SpinalConnection;

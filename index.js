/**
 * Copyright 2015 SpinalCom - www.spinalcom.com
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

var config = require("./config.js");
var SpinalConnection = require("./modules/SpinalConnection.js");
var serverProcess = require("./modules/ServerProcess.js");
require("spinal-core-connectorjs");

/**
 * main function the starting point of the script
 */
function main() {
  const spinalConnection = new SpinalConnection(config);

  spinalConnection
    .init() // initialize the connection to the spinalhub
    .then(() => {
      // auth done successfully, starting to load or store
      return spinalConnection.loadOrStore(config.SPINAL_FILE_PATH, global.Lst);
    }, err_connect)
    .then(model => {
      // load or store sucess got the model
      // starting tcp server process
      new serverProcess(config, model);
    }, err_connect);
}

/**
 * handle the error of connection,
 * Print the error then exit.
 *
 * @param {Error} err
 */
function err_connect(err) {
  if (!err) console.log("Error Connect.");
  else console.log("Error Connect : " + err);
  process.exit(0);
}

main();

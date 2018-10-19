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
const spinalCore = require("spinal-core-connectorjs");
const SpinalEndpoint = require("./SpinalEndpoint.js");

class SpinalDevices extends global.Model {
  constructor() {
    super();
    this.add_attr({
      dp_bim_prefix: "",
      dp_time: 0,
      data: []
    });
  }

  update(json) {
    this.dp_bim_prefix.set(json.dp_bim_prefix);
    this.dp_time.set(json.dp_time);
    for (var i = 0; i < json.data.length; i++) {
      let endpoint = this._searchInData(json.data[i]);
      if (endpoint === null) {
        endpoint = new SpinalEndpoint();
        this.data.push(endpoint);
      }
      endpoint.update(json.data[i]);
    }
  }

  _searchInData(json) {
    for (var i = 0; i < this.data.length; i++) {
      const endpoint = this.data[i];
      if (endpoint.dp_bim_postfix.get() === json.dp_bim_postfix) {
        return endpoint;
      }
    }
    return null;
  }
}

module.exports = SpinalDevices;
spinalCore.register_models([SpinalDevices]);

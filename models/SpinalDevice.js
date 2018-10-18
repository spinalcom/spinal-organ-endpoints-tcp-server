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

const spinalCore = require("spinal-core-connectorjs");

class SpinalEndpoint extends global.Model {
  constructor() {
    super();
    this.add_attr({
      dp_bim_postfix: "",
      dp_bim_format: "",
      dp_unit: "",
      dp_value_f: 0
    });
  }

  update(json) {
    this.dp_bim_postfix.set(json.dp_bim_postfix);
    this.dp_bim_format.set(json.dp_bim_format);
    this.dp_value_f.set(json.dp_value_f);
    this.dp_unit.set(json.dp_unit);
  }
}

module.exports = SpinalEndpoint;
spinalCore.register_models([SpinalEndpoint]);

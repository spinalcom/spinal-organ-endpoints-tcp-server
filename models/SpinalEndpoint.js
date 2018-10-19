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
    if (
      typeof json.dp_value_f === "string" &&
      this.dp_value_f instanceof global.Val
    )
      this.mod_attr("dp_value_f", new global.Str(json.dp_value_f));
    else if (
      typeof json.dp_value_f === "number" &&
      this.dp_value_f instanceof global.Str
    )
      this.mod_attr("dp_value_f", new global.Val(json.dp_value_f));
    else this.dp_value_f.set(json.dp_value_f);
    this.dp_unit.set(json.dp_unit);
  }
}

module.exports = SpinalEndpoint;
spinalCore.register_models([SpinalEndpoint]);

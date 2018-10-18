const net = require("net");
const client = new net.Socket();
const port = 7070;
const host = "127.0.0.1";
const obj = {
  dp_bim_prefix: " D1_C1_VC_01",
  dp_time: Date.now(),
  data: [
    {
      dp_bim_postfix: "nciSensOffTemp",
      dp_bim_format: "NUMBER",
      dp_value_f: Math.random(40) * 100,
      dp_unit: "deg"
    },
    {
      dp_bim_postfix: "nvoSensFanSpeed_value",
      dp_bim_format: "NUMBER",
      dp_value_f: Math.random(40) * 100,
      dp_unit: "%"
    }
  ]
};

client.connect(port, host, function() {
  console.log("Connected");
  const str = JSON.stringify(obj, null, 2);
  console.log(str);
  client.write(str);
});

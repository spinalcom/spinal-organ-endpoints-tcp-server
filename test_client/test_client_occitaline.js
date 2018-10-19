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
      dp_value_f: Math.random() * 100,
      dp_unit: "deg"
    },
    {
      dp_bim_postfix: "nvoSensFanSpeed_value",
      dp_bim_format: "NUMBER",
      dp_value_f: Math.random() * 100,
      dp_unit: "%"
    },
    {
      dp_bim_postfix: "SensFanStatus",
      dp_bim_format: "STRING",
      dp_value_f: Math.floor(Math.random() * 2) === 1 ? "OK" : "KO",
      dp_unit: "STRING"
    }
  ]
};

client.connect(port, host, function() {
  console.log("Connected");
  const str = JSON.stringify(obj, null, 2);
  console.log(str);
  client.write(str);
});

/**
 * Default organ config
 */
module.exports = {};
if (!process.env.SPINAL_USER_ID) {
  console.log("default config");
}
process.env.SPINAL_USER_NAME = process.env.SPINAL_USER_NAME || "admin";
process.env.SPINAL_PASSWORD =
  process.env.SPINAL_PASSWORD || "JHGgcz45JKilmzknzelf65ddDadggftIO98P";
process.env.SPINALHUB_IP = process.env.SPINALHUB_IP || "localhost";
process.env.SPINALHUB_PORT = process.env.SPINALHUB_PORT || 7777;
process.env.SPINAL_FILE_PATH =
  process.env.SPINAL_FILE_PATH || "Occitaline/DevicesList";

// connection to hub
module.exports.SPINAL_USER_NAME = process.env.SPINAL_USER_NAME;
module.exports.SPINAL_PASSWORD = process.env.SPINAL_PASSWORD;
module.exports.SPINALHUB_IP = process.env.SPINALHUB_IP;
module.exports.SPINALHUB_PORT = process.env.SPINALHUB_PORT;
module.exports.SPINAL_FILE_PATH = process.env.SPINAL_FILE_PATH;
module.exports.CONNECTION_SPINALHUB_INTERVAL = 1000;
module.exports.CONNECTION_SPINALHUB_TIMEOUT = 10000; // time in ms || 0 = infinite

// tcp server specific

module.exports.TCP_PORT_LISTEN = process.env.TCP_PORT_LISTEN || 7070;
module.exports.DEBUG = process.env.DEBUG || true;

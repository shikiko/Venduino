const { safeLoad } = require("js-yaml");
const CHECKSUM_KEY = 'SPEC CHECKSUMS';
// Previous portions of the lock file could be invalid yaml.
// Only parse parts that are valid
const tail = fileContent.split(CHECKSUM_KEY).slice(1);
const checksumTail = CHECKSUM_KEY + tail;
return Object.keys(safeLoad(checksumTail)[CHECKSUM_KEY] || {});

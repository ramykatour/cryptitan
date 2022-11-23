const path = require("path");
const merger = require("json-merger");
const fs = require("fs");
const glob = require("glob");

const output = path.join(__dirname, 'lang/en.json');
const pattern = path.join(__dirname, 'resources/messages/*.json');

const files = [output].concat(glob.sync(pattern));
const content = JSON.stringify(merger.mergeFiles(files), null, 2);

fs.writeFileSync(output, content, 'utf-8');
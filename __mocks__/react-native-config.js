const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(
  path.resolve(__dirname, '../.env.example'),
  'utf-8',
);
const config = {};

envFile.split('\n').forEach(line => {
  if (line) {
    const equalIndex = line.indexOf('=');
    const key = line.substring(0, equalIndex);
    const value = line.substring(equalIndex + 1);
    config[key] = value;
  }
});

module.exports = config;

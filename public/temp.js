const fs = require('fs');
const { FlightLog } = require('./flightlog/flightlog');

const fl = new FlightLog(fs.readFileSync('/Users/sdickinson/development/blackbox_height_frames/LOG00144.BFL'))

fl.openLog(0);
console.log(fl.getLogError());
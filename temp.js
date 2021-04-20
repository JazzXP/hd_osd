const lineByLine = require("n-readlines");

const liner = new lineByLine('/Users/sdickinson/development/blackbox_height_frames/btfl_002.01.csv');
  let line;
  let retHeadings = null;
  let firstLoopTime = -1;
  let hz = 0;
  let retRow = null;
  while ((line = `${liner.next()}`)) {
    if (retHeadings === null) {
      if (line.indexOf("loopIteration") !== -1) {
        // Dodgy hack to remove quotes while splitting csv
        const headings = line.startsWith('"') ? line.split(/","/) : line.split(', ');
        console.log(line);
        headings[0] = headings[0].replace('"', "");
        headings[headings.length - 1] = headings[headings.length - 1].replace(
          '"',
          ""
        );
        retHeadings = headings;
      }
    } else {
      if (firstLoopTime === -1) {
        firstLoopTime = parseInt(line.split(",")[1], 10);
      } else {
        retRow = line.split(",");
        const time = parseInt(line.split(",")[1], 10);
        let ms = (time - firstLoopTime) / 1000;
        if (ms >= 1000) {
          hz = parseInt(line.split(",")[0], 10);
          break;
        }
      }
    }
  }

  console.log(`${hz}Hz`)
  console.log(retHeadings);
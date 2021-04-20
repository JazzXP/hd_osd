const { app, BrowserWindow, ipcMain } = require("electron");
const lineByLine = require("n-readlines");
const fontList = require("font-list");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "/preload.js",
    },
  });

  // and load the index.html of the app.
  win.loadURL("http://localhost:3000/");
  // win.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
}
app.on("ready", createWindow);

ipcMain.handle("get-csv-data", async (event, ...args) => {
  let skip = 0;
  const liner = new lineByLine(args[0]);
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
        headings[0] = headings[0].replace('"', "");
        headings[headings.length - 1] = headings[headings.length - 1].replace(
          '"',
          ""
        );
        retHeadings = headings;
      } else {
        skip++;
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

  return {
    headings: retHeadings,
    hz,
    randomRow: retRow,
  };
});

const FONT_MODIFIERS = [
  "black",
  "bold",
  "regular",
  "italic",
  "heavy",
  "light",
  "medium",
  "semibold",
  "thin",
  "ultralight",
];

ipcMain.handle("get-system-fonts", async () => {
  return (await fontList.getFonts()).map((font) => font.replace(/"/g, ""));
});

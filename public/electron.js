const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const lineByLine = require("n-readlines");
const getSystemFonts = require("get-system-fonts");

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

ipcMain.handle("get-csv-headings", async (event, ...args) => {
  let skip = 0;
  const liner = new lineByLine(args[0]);
  let line;
  while ((line = liner.next())) {
    if (line.indexOf("loopIteration") !== -1) {
      // Dodgy hack to remove quotes while splitting csv
      const headings = `${line}`.split(/","/);
      headings[0] = headings[0].replace('"', "");
      headings[headings.length - 1] = headings[headings.length - 1].replace(
        '"',
        ""
      );

      return headings;
    } else {
      skip++;
    }
  }

  return null;
});

ipcMain.handle("get-system-fonts", async () => {
  return await getSystemFonts();
});

import React, { createRef, useState } from "react";
import {
  HeadingList,
  OutputDetails,
  OSD,
  OSDElement,
  FontSelector,
} from "./components";

interface csvData {
  headings: string[];
  hz: number;
}

function App() {
  const ipcRenderer = (window as any).ipcRenderer;
  const fileRef = createRef<HTMLInputElement>();
  const osdRef = createRef<HTMLElement>();
  const [headings, setHeadings] = useState<string[]>([]);
  const [hz, setHz] = useState<number>(0);

  return (
    <div className="App" style={{ background: "#fff" }}>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        onSubmit={async (event) => {
          event.preventDefault();
          //@ts-ignore
          const fullpath = fileRef.current?.files?.[0].path;
          const { headings, hz }: csvData = await ipcRenderer.invoke(
            "get-csv-data",
            fullpath
          );
          setHeadings(headings);
          setHz(hz);
        }}
      >
        <span>
          <label htmlFor="csvfile">Blackbox CSV:</label>
          <input type="file" ref={fileRef} id="csvFile" />
        </span>
        <span>
          <input type="submit" value="Load" />
        </span>
        <OutputDetails />
        <div style={{ display: "flex" }}>
          <HeadingList items={headings} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <FontSelector />
            <OSD
              elements={[
                "BaroAlt",
              ]}
              elementPositions={[{ x: 50, y: 50 }]}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;

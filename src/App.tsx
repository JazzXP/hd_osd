import React, { createRef, useState } from "react";
import { HeadingList, OutputDetails, OSD, FontSelector } from "./components";
import { GlobalCtx } from "./context/global";
import { Point } from "./util/point";

interface csvData {
  headings: string[];
  hz: number;
}

function App() {
  const ipcRenderer = (window as any).ipcRenderer;
  const fileRef = createRef<HTMLInputElement>();
  const [headings, setHeadings] = useState<string[]>([]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [hz, setHz] = useState<number>(0);
  const [currentResolution, setCurrentResolution] = useState<Point>({
    x: 1920,
    y: 1080,
  });

  return (
    <GlobalCtx.Provider
      value={{
        resolution: currentResolution,
        setResolution: (p) => {
          setCurrentResolution(p);
        },
      }}
    >
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
            const { headings, hz: inputHz }: csvData = await ipcRenderer.invoke(
              "get-csv-data",
              fullpath
            );
            setHeadings(headings);
            setHz(inputHz);
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
            <HeadingList
              items={headings}
              onSelect={(item, idx, selected) => {
                if (selected) {
                  if (
                    (selectedElements.find((i) => i === item)?.length ?? 0) ===
                    0
                  ) {
                    setSelectedElements([...selectedElements, item]);
                  }
                } else {
                  setSelectedElements(
                    selectedElements.filter((i) => i !== item)
                  );
                }
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <FontSelector />
              <OSD
                elements={selectedElements}
                elementPositions={[{ x: 50, y: 50 }]}
                res={currentResolution}
              />
            </div>
          </div>
        </form>
      </div>
    </GlobalCtx.Provider>
  );
}

export default App;

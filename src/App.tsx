import React, { createRef, useEffect, useState } from "react";
import { HeadingList, OutputDetails, OSD, FontSelector } from "./components";
import { GlobalCtx } from "./context/global";
import { Point, Dictionary, ElementState } from "./util";
interface csvData {
  headings: string[];
  hz: number;
  randomRow: string[];
}

function App() {
  const ipcRenderer = (window as any).ipcRenderer;
  const fileRef = createRef<HTMLInputElement>();
  const formRef = createRef<HTMLFormElement>();
  const [headings, setHeadings] = useState<string[]>([]);
  const [selectedElements, setSelectedElements] = useState<
    Dictionary<ElementState>
  >({} as Dictionary<ElementState>);
  const [hz, setHz] = useState<number>(0);
  const [currentResolution, setCurrentResolution] = useState<Point>({
    x: 1920,
    y: 1080,
  });
  const [randomRow, setRandomRow] = useState<string[]>([]);
  const [row, setRow] = useState<Dictionary<string>>({} as Dictionary<string>);

  useEffect(() => {
    const temp = headings.reduce<Dictionary<string>>((acc, item, idx) => {
      acc[item] = randomRow[idx];
      return acc;
    }, {} as Dictionary<string>);
    setRow(temp);
  }, [headings, randomRow]);

  const loadFile = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    //@ts-ignore
    const fullpath = fileRef.current?.files?.[0].path;
    const {
      headings,
      hz: inputHz,
      randomRow,
    }: csvData = await ipcRenderer.invoke("get-csv-data", fullpath);
    setHeadings(headings);
    setHz(inputHz);
    setRandomRow(randomRow);
  };

  return (
    <GlobalCtx.Provider
      value={{
        resolution: currentResolution,
        setResolution: (p) => {
          setCurrentResolution(p);
        },
        rowData: row,
        rowSettings: selectedElements,
      }}
    >
      <div className="App" style={{ background: "#fff", height: "100vh" }}>
        <form
          ref={formRef}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={loadFile}
        >
          <span>
            <label htmlFor="csvfile">Blackbox CSV:</label>
            <input type="file" ref={fileRef} id="csvFile" onInput={loadFile} />
          </span>
          <OutputDetails />
          <div style={{ display: "flex" }}>
            <HeadingList
              items={headings}
              onChecked={(item, idx, selected) => {
                if (selected) {
                  if (
                    (Object.keys(selectedElements).find(
                      (key) => selectedElements[key].type === item
                    )?.length ?? 0) === 0
                  ) {
                    const tempItem: ElementState = {
                      type: item,
                      fontFamily: "Arial",
                      fontSize: 1,
                      position: { x: 0, y: 0 },
                      enabled: selected,
                    };
                    const tempElements: Dictionary<ElementState> = {} as Dictionary<ElementState>;
                    Object.assign(tempElements, selectedElements);
                    tempElements[item] = tempItem;
                    setSelectedElements(tempElements);
                  }
                } else {
                  const tempElements: Dictionary<ElementState> = {} as Dictionary<ElementState>;
                  Object.assign(tempElements, selectedElements);
                  tempElements[item].enabled = selected;
                  setSelectedElements(selectedElements);
                }
              }}
              onSelect={(item) => {}}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <OSD
                elements={selectedElements}
                res={currentResolution}
                rowData={row}
              />
              <FontSelector />
            </div>
          </div>
        </form>
      </div>
    </GlobalCtx.Provider>
  );
}

export default App;

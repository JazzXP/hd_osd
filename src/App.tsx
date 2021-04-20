import React, { useEffect, useMemo, useRef, useState } from "react";
import { HeadingList, OutputDetails, OSD, FontSelector } from "./components";
import { GlobalCtx } from "./context/global";
import { Point, Dictionary, ElementState } from "./util";
interface csvData {
  headings: string[];
  hz: number;
  randomRow: string[];
}

function useFile(ipcRenderer: any) {
  const [headings, setHeadings] = useState<string[]>([]);
  const [hz, setHz] = useState<number>(0);
  const [randomRow, setRandomRow] = useState<string[]>([]);

  const load = useMemo(
    () => async (filename: string) => {
      const {
        headings,
        hz: inputHz,
        randomRow,
      }: csvData = await ipcRenderer.invoke("get-csv-data", filename);
      setHeadings(headings);
      setHz(inputHz);
      setRandomRow(randomRow);
    },
    [ipcRenderer]
  );
  return { headings, hz, randomRow, load };
}

function useResolution() {
  const [currentResolution, setCurrentResolution] = useState<Point>({
    x: 1920,
    y: 1080,
  });

  return { currentResolution, setCurrentResolution };
}

function useRow(headings: string[], randomRow: string[]) {
  const [row, setRow] = useState<Dictionary<string>>({} as Dictionary<string>);

  useEffect(() => {
    const temp = headings.reduce<Dictionary<string>>((acc, item, idx) => {
      acc[item] = randomRow[idx];
      return acc;
    }, {} as Dictionary<string>);
    setRow(temp);
  }, [headings, randomRow]);

  return { row };
}

function useSelectedElements() {
  const [selectedElements, setSelectedElements] = useState<
    Dictionary<ElementState>
  >({} as Dictionary<ElementState>);

  const addOrSelectElement = (type: string) => {
    const existingKey = Object.keys(selectedElements).find(
      (key) => selectedElements[key].type === type
    );
    if (existingKey) {
      const tempElements: Dictionary<ElementState> = {} as Dictionary<ElementState>;
      Object.assign(tempElements, selectedElements);
      tempElements[existingKey].enabled = true;
      setSelectedElements(tempElements);
    } else {
      const element: ElementState = {
        type: type,
        fontFamily: "Arial",
        fontSize: 1,
        fontColour: "#ffffff",
        position: { x: 0, y: 0 },
        enabled: true,
      };
      const tempElements: Dictionary<ElementState> = {} as Dictionary<ElementState>;
      Object.assign(tempElements, selectedElements);
      tempElements[element.type] = element;
      setSelectedElements(tempElements);
    }
  };

  const deselectElement = (type: string) => {
    const tempElements: Dictionary<ElementState> = {} as Dictionary<ElementState>;
    Object.assign(tempElements, selectedElements);
    tempElements[type].enabled = false;
    setSelectedElements(tempElements);
  };

  return { selectedElements, addOrSelectElement, deselectElement };
}

function App() {
  const ipcRenderer = (window as any).ipcRenderer;
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { headings, hz, randomRow, load } = useFile(ipcRenderer);
  const [selectedElement, setSelectedElement] = useState<ElementState>();

  const {
    selectedElements,
    addOrSelectElement,
    deselectElement,
  } = useSelectedElements();

  const { currentResolution, setCurrentResolution } = useResolution();
  const { row } = useRow(headings, randomRow);

  const loadFile = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    //@ts-ignore
    const fullpath = fileRef.current?.files?.[0].path;
    load(fullpath);
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
                  addOrSelectElement(item);
                } else {
                  deselectElement(item);
                }
              }}
              onSelect={(item) => {
                setSelectedElement(selectedElements[item]);
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <OSD
                elements={selectedElements}
                res={currentResolution}
                rowData={row}
              />
              <FontSelector
                fontFamily={selectedElement?.fontFamily}
                fontSize={selectedElement?.fontSize}
                fontColour={selectedElement?.fontColour}
              />
            </div>
          </div>
        </form>
      </div>
    </GlobalCtx.Provider>
  );
}

export default App;

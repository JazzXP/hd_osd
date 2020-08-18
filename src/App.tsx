import React, { createRef, useState } from "react";
import {
  HeadingList,
  OutputDetails,
  OSD,
  OSDElement,
  FontSelector,
} from "./components";

function App() {
  const ipcRenderer = (window as any).ipcRenderer;
  // useEffect(() => {
  //   ipcRenderer.invoke("api-test", "blah").then((val: any) => console.log(val));
  // }, []);
  const fileRef = createRef<HTMLInputElement>();
  const [headings, setHeadings] = useState<string[]>([]);

  return (
    <div className="App">
      <form
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        onSubmit={async (event) => {
          event.preventDefault();
          //@ts-ignore
          const fullpath = fileRef.current?.files?.[0].path;
          const headings: string[] = await ipcRenderer.invoke(
            "get-csv-headings",
            fullpath
          );
          setHeadings(headings);
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
              elements={[<OSDElement type="" value={0} />]}
              elementPositions={[{ x: 0, y: 0 }]}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;

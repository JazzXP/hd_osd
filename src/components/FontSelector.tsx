import React, { useEffect, useState } from "react";
import { SketchPicker, Color } from "react-color";

export const FontSelector = () => {
  const ipcRenderer = (window as any).ipcRenderer;
  const [fontList, setFontList] = useState<string[]>([]);
  const [colour, setColour] = useState<Color>();
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  useEffect(() => {
    ipcRenderer.invoke("get-system-fonts").then((fonts: string[]) => {
      setFontList(fonts);
    });
  }, [ipcRenderer]);
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingRight: "16px",
        }}
      >
        <label htmlFor="fontPicker">Font Family:</label>
        <select
          value={fontFamily}
          id="fontPicker"
          onChange={(event) => {
            setFontFamily(event.currentTarget.value);
          }}
        >
          {fontList.map((font) => (
            <option key={font}>{font}</option>
          ))}
        </select>
        <label>Font Size:</label>
        <input type="number" />
      </div>
      <SketchPicker
        disableAlpha
        presetColors={[
          "red",
          "green",
          "blue",
          "cyan",
          "yellow",
          "magenta",
          "black",
          "white",
        ]}
        color={colour}
        onChange={(colorResult) => {
          setColour(colorResult.rgb);
        }}
      />
    </div>
  );
};

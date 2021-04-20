import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";

interface FontSelectorProps {
  fontFamily?: string;
  fontSize?: number;
  fontColour?: string;
}
export const FontSelector: React.FC<FontSelectorProps> = ({
  fontFamily,
  fontSize,
  fontColour,
}) => {
  const ipcRenderer = (window as any).ipcRenderer;
  const [fontList, setFontList] = useState<string[]>([]);
  const [colour, setColour] = useState(fontColour);
  const [font, setFont] = useState(fontFamily);
  const [size, setSize] = useState(fontSize);
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
          value={font}
          id="fontPicker"
          onChange={(event) => {
            setFont(event.currentTarget.value);
          }}
        >
          {fontList.map((font) => (
            <option key={font}>{font}</option>
          ))}
        </select>
        <label>Font Size:</label>
        <input
          type="number"
          value={size}
          onChange={(event) => {
            setSize(Number(event.currentTarget.value));
          }}
        />
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
          setColour(colorResult.rgb.toString());
        }}
      />
    </div>
  );
};

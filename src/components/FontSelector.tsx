import React, { useEffect, useRef, useState } from "react";
import { SketchPicker } from "react-color";

interface FontSelectorProps {
  fontFamily?: string;
  fontSize?: number;
  fontColour?: string;
  onFontChange?: (
    fontFamily: string,
    fontSize: number,
    fontColour: string
  ) => void;
}
export const FontSelector: React.FC<FontSelectorProps> = ({
  fontFamily,
  fontSize,
  fontColour,
  onFontChange,
}) => {
  const ipcRenderer = (window as any).ipcRenderer;
  const [fontList, setFontList] = useState<string[]>([]);
  useEffect(() => {
    ipcRenderer.invoke("get-system-fonts").then((fonts: string[]) => {
      setFontList(fonts);
    });
  }, [ipcRenderer]);
  const fontFamilyRef = useRef<HTMLSelectElement>(null);
  const fontSizeRef = useRef<HTMLInputElement>(null);
  let fontColourRef = fontColour;
  const updateFont = () => {
    onFontChange?.(
      fontFamilyRef.current?.value ?? "",
      Number(fontSizeRef.current?.value ?? 0),
      fontColourRef ?? ""
    );
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
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
          ref={fontFamilyRef}
          onChange={updateFont}
        >
          {fontList.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <label>Font Size:</label>
        <input
          type="number"
          value={fontSize}
          ref={fontSizeRef}
          onChange={updateFont}
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
        color={fontColourRef}
        onChange={(colorResult) => {
          fontColourRef = colorResult.hex;
          updateFont();
        }}
      />
    </div>
  );
};

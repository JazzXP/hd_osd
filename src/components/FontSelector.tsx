import React, { useEffect, useState } from "react";

export const FontSelector = () => {
  const ipcRenderer = (window as any).ipcRenderer;
  const [fontList, setFontList] = useState<string[]>([]);
  useEffect(() => {
    ipcRenderer.invoke("get-system-fonts").then((fonts: string[]) => {
      setFontList(fonts);
    });
  }, [ipcRenderer]);
  return (
    <select value="Arial">
      {fontList.map((font) => (
        <option key={font}>{font}</option>
      ))}
    </select>
  );
};

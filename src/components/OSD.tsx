import React from "react";
import { OSDElement } from "./OSDElement";
import { Point, Dictionary, ElementState } from "../util";
interface OSDProps {
  elements: Dictionary<ElementState>;
  res: Point;
  rowData?: Dictionary<string>;
}

export const OSD: React.FC<OSDProps> = ({ elements, res, rowData }) => {
  const scaledRes = {
    x: 480,
    y: 480 * (res.y / res.x),
  };
  return (
    <div
      style={{
        position: "relative",
        width: scaledRes.x,
        height: scaledRes.y,
        background: "#000",
      }}
      id="osd"
    >
      {Object.keys(elements)
        .filter((key) => elements[key].enabled)
        .map((key) => {
          const element = elements[key];
          return (
            <OSDElement
              type={element.type}
              value={Number(rowData?.[element.type] ?? 0)}
              defaultPos={element.position}
              key={element.type}
              fontFamily="Arial"
              fontSize={10}
              res={scaledRes}
            />
          );
        })}
    </div>
  );
};

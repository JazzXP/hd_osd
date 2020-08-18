import React from "react";

interface Point {
  x: number;
  y: number;
}

interface OSDProps {
  elements: JSX.Element[];
  elementPositions: Point[];
}

export const OSD = (props: OSDProps) => {
  return (
    <div
      style={{
        position: "relative",
        width: 480,
        height: 270,
        background: "#000",
      }}
    >
      {props.elements.map((element, idx) => {
        const pos = props.elementPositions[idx];
        return (
          <div style={{ position: "absolute", left: pos.x, top: pos.y }}>
            {element}
          </div>
        );
      })}
    </div>
  );
};

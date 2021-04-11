import React from "react";
import { OSDElement } from "./OSDElement";
import { Point } from "../util/point";

interface OSDProps {
  elements: string[];
  elementPositions: Point[];
  res: Point;
}

export const OSD = (props: OSDProps) => {
  return (
    <div
      style={{
        position: "relative",
        width: 480,
        height: 480 * (props.res.y / props.res.x),
        background: "#000",
      }}
      id="osd"
    >
      {props.elements.map((element, idx) => {
        const pos = props.elementPositions[idx];
        return (
          <OSDElement
            type={element}
            value={0}
            defaultPos={pos}
            key={element}
            fontFamily="Arial"
            fontSize={5}
          />
        );
      })}
    </div>
  );
};

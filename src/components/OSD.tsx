import React from "react";
import { OSDElement } from "./OSDElement";
import { Point } from "../util/point";

interface OSDProps {
  elements: string[];
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
      id="osd"
    >
      {props.elements.map((element, idx) => {
        const pos = props.elementPositions[idx];
        return <OSDElement type={element} value={0} defaultPos={pos} />;
      })}
    </div>
  );
};

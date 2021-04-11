import React from "react";
import { getConversionFunction } from "../util/valueconversion";
import { Point } from "../util/point";
import Draggable from "react-draggable";

interface OSDElementProps {
  type: string;
  value: number;
  defaultPos: Point;
  setCurrentPos?: (x: number, y: number) => void;
  fontFamily: string;
  fontSize: number;
}

export const OSDElement = (props: OSDElementProps) => {
  return (
    <Draggable
      onStop={(event, data) => {
        props.setCurrentPos?.(data.x, data.y);
      }}
      bounds="parent"
      defaultPosition={props.defaultPos}
    >
      <div
        style={{
          color: "#f00",
          display: "inline-block",
          fontFamily: props.fontFamily,
          fontSize: `${props.fontSize}%`,
        }}
      >
        {getConversionFunction(props.type)(props.value)}
      </div>
    </Draggable>
  );
};

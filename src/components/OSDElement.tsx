import React from "react";
import { getConversionFunction, Point } from "../util";
import Draggable from "react-draggable";

interface OSDElementProps {
  type: string;
  value: number;
  defaultPos: Point;
  setCurrentPos?: (x: number, y: number) => void;
  fontFamily: string;
  fontSize: number;
  res: Point;
}

export const OSDElement: React.FC<OSDElementProps> = ({
  type,
  value,
  defaultPos,
  setCurrentPos,
  fontFamily,
  fontSize,
  res,
}) => {
  return (
    <Draggable
      onStop={(event, data) => {
        setCurrentPos?.(data.x, data.y);
      }}
      bounds="parent"
      defaultPosition={defaultPos}
    >
      <div
        style={{
          color: "#f00",
          background: "blue",
          display: "inline-block",
          fontFamily,
          fontSize: `${res.y * (fontSize / 100)}px`,
        }}
      >
        {getConversionFunction(type)(value)}
      </div>
    </Draggable>
  );
};

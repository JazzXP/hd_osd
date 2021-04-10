import React from "react";
import { getConversionFunction } from "../util/valueconversion";
import { Point } from "../util/point";
import Draggable from "react-draggable";

interface OSDElementProps {
  type: string;
  value: number;
  defaultPos: Point;
}

export const OSDElement = (props: OSDElementProps) => {
  return (
    <Draggable
      onStop={(event, data) => {
        //@ts-ignore
        // const e: MouseEvent = event;
        // console.log(item.current?.attributes);
        console.log(data);
      }}
      bounds="parent"
      defaultPosition={props.defaultPos}
    >
      <div style={{ color: "#f00", display: "inline-block" }}>
        {getConversionFunction(props.type)(props.value)}
      </div>
    </Draggable>
  );
};

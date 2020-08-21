import React from "react";
import { getConversionFunction } from "../util/valueconversion";

interface OSDElementProps {
  type: string;
  value: number;
}

export const OSDElement = (props: OSDElementProps) => {
  return (
    <div style={{ color: "#f00" }}>
      {getConversionFunction(props.type)(props.value)}
    </div>
  );
};

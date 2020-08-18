import React from "react";

interface OSDElementProps {
  type: string;
  value: number;
}

export const OSDElement = (props: OSDElementProps) => {
  return <div style={{ color: "#f00" }}>Element {props.type}</div>;
};

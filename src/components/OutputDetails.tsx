import React from "react";
import { ResolutionSelector } from ".";

export const OutputDetails = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>
        <label
          htmlFor="resolution"
          style={{ display: "inline-block", width: 120 }}
        >
          Resolution
        </label>
        <ResolutionSelector id="resolution" />
      </span>
      <span>
        <label
          htmlFor="framerate"
          style={{ display: "inline-block", width: 120 }}
        >
          Framerate
        </label>
        <input type="number" value={25} id="framerate" />
        fps
      </span>
      <span>
        <label
          htmlFor="outputLocation"
          style={{ display: "inline-block", width: 120 }}
        >
          Output Location
        </label>
        <input type="text" id="outputLocation" />
      </span>
    </div>
  );
};

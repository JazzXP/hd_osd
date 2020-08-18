import React from "react";
import { ResolutionSelector } from ".";

export const OutputDetails = () => {
  return (
    <div>
      <span>
        <label htmlFor="resolution">Resolution</label>
        <ResolutionSelector id="resolution" />
      </span>
      <span>
        <label htmlFor="framerate">Framerate</label>
        <input type="number" value={25} id="framerate" />
        fps
      </span>
      <span>
        <label htmlFor="outputLocation">Output Location</label>
        <input type="text" id="outputLocation" />
      </span>
    </div>
  );
};

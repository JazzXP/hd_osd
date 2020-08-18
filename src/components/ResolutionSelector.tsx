import React from "react";

export const ResolutionSelector = (
  props: React.HTMLProps<HTMLSelectElement>
) => {
  return (
    <select {...props}>
      <option value="720p" data-width="1280" data-height="720">
        720p - 1280x720
      </option>
      <option value="1080p" data-width="1920" data-height="1080">
        1080p - 1920x1080
      </option>
      <option value="UHD" data-width="3840" data-height="2160">
        UHD - 3840x2160
      </option>
      <option value="Cinema4k" data-width="4096" data-height="2160">
        Cinema 4k - 4096 x2160
      </option>
      <option value="4:3-960p" data-width="1280" data-height="960">
        4:3 - 1280x960
      </option>
      <option value="4:3-1440p" data-width="1920" data-height="1440">
        4:3 - 1920x1440
      </option>
    </select>
  );
};

import { createContext } from 'react';
import { Point, Dictionary, ElementState } from '../util';

export const GlobalCtx = createContext({
  resolution: {x: 1920, y: 1080},
  setResolution: (p: Point) => {},
  rowData: {} as Dictionary<string>,
  rowSettings: {} as Dictionary<ElementState>,
});
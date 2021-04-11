import { createContext } from 'react';
import {Point} from '../util/point';

export const GlobalCtx = createContext({
  resolution: {x: 1920, y: 1080},
  setResolution: (p: Point) => {}
});
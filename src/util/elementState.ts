import { Point } from './point';
export interface ElementState {
  type: string,
  fontFamily: string,
  fontSize: number,
  position: Point,
  enabled: boolean,
};
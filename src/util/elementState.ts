import { Point } from './point';
export interface ElementState {
  type: string,
  fontFamily: string,
  fontSize: number,
  fontColour: string,
  position: Point,
  enabled: boolean,
};
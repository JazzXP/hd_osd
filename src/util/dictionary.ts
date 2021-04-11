export interface Dictionary<U> extends Iterable<U> {
  [index: string]: U;
}
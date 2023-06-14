"use strict";

function makeMatrix(x, y, p=0) {
  return new Array(y).fill(p).map(() => new Array(x).fill(p))
}
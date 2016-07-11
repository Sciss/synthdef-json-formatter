"use strict";

const assert = require("assert");
const test = require("eater/runner").test;
const formatter = require("../src");

test("empty", () => {
  const expected = `
{
  "name": "empty",
  "consts": [],
  "paramValues": [],
  "paramIndices": {},
  "specs": [],
  "variants": {}
}`
.trim();

  const synthdef = JSON.parse(expected);
  const actual = formatter.format(synthdef);

  assert(actual === expected);
});

test("sine", () => {
  const expected = `
{
  "name": "sine",
  "consts": [ 0 ],
  "paramValues": [ 0.5, 440 ],
  "paramIndices": {
    "amp" : { "index": 0, "length": 1 },
    "freq": { "index": 1, "length": 1 }
  },
  "specs": [
    [ "Control"     , 1, 0, [                                ], [ 1, 1 ] ],
    [ "SinOsc"      , 2, 0, [ [  0, 1 ], [ -1, 0 ]           ], [ 2    ] ],
    [ "BinaryOpUGen", 2, 2, [ [  1, 0 ], [  0, 0 ]           ], [ 2    ] ],
    [ "Out"         , 2, 0, [ [ -1, 0 ], [  2, 0 ], [ 2, 0 ] ], [      ] ]
  ],
  "variants": {
    "alpha": [ 0.25,  880 ],
    "beta" : [  0.5, 1760 ]
  }
}
`.trim();

  const synthdef = JSON.parse(expected);
  const actual = formatter.format(synthdef);

  assert(actual === expected);
});

test("specs", () => {
  const expected = `
{
  "name": "specs",
  "consts": [],
  "paramValues": [],
  "paramIndices": {},
  "specs": [
    [ "A"  ,   1,   2, [ [ 0, 1 ]                                         ], [ 0 ] ],
    [ "BB" ,  10,  20, [ [ 0, 1 ], [ 2, 3 ], [ 4, 5 ], [ 6, 7 ], [ 8, 9 ] ], [ 1 ] ],
    [ "CCC", 100, 200, [ [ 0, 1 ], [ 2, 3 ]                               ], [   ] ]
  ],
  "variants": {}
}
`.trim();

  const synthdef = JSON.parse(expected);
  const actual = formatter.format(synthdef);

  assert(actual === expected);
});

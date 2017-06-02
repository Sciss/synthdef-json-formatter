"use strict";

const assert = require("assert");
const test = require("eatest");
const toPairs = require("lodash.topairs");
const formatter = require("../src");

test("empty:1", () => {
  const expected = `
{
  "name": "",
  "consts": [],
  "units": []
}`
.trim();

  const synthdef = JSON.parse(expected);
  const actual = formatter.format(synthdef);

  assert(actual === expected);
  assert.deepEqual(JSON.parse(actual), synthdef);
});

test("empty:2", () => {
  const expected = `
{
  "name": "empty",
  "consts": [],
  "paramValues": [],
  "paramIndices": {},
  "units": [],
  "variants": {}
}`
.trim();

  const synthdef = JSON.parse(expected);
  const actual = formatter.format(synthdef);

  assert(actual === expected);
  assert.deepEqual(JSON.parse(actual), synthdef);
});

test("empty:3", () => {
  const expected = `
{
  "name": "empty",
  "consts": [],
  "paramValues": [],
  "paramIndices": [],
  "units": [],
  "variants": []
}`
.trim();

  const synthdef = JSON.parse(expected);
  const actual = formatter.format(synthdef);

  assert(actual === expected);
  assert.deepEqual(JSON.parse(actual), synthdef);
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
  "units": [
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
  assert.deepEqual(JSON.parse(actual), synthdef);
});

test("sine:2", () => {
  const expected = `
{
  "name": "sine",
  "consts": [ 0 ],
  "paramValues": [ 0.5, 440 ],
  "paramIndices": [
    { "name": "amp" , "index": 0, "length": 1 },
    { "name": "freq", "index": 1, "length": 1 }
  ],
  "units": [
    [ "Control"     , 1, 0, [                                ], [ 1, 1 ] ],
    [ "SinOsc"      , 2, 0, [ [  0, 1 ], [ -1, 0 ]           ], [ 2    ] ],
    [ "BinaryOpUGen", 2, 2, [ [  1, 0 ], [  0, 0 ]           ], [ 2    ] ],
    [ "Out"         , 2, 0, [ [ -1, 0 ], [  2, 0 ], [ 2, 0 ] ], [      ] ]
  ],
  "variants": [
    { "name": "alpha", "values": [ 0.25,  880 ] },
    { "name": "beta" , "values": [  0.5, 1760 ] }
  ]
}
`.trim();

  const synthdef = JSON.parse(expected);
  const actual = formatter.format(synthdef);

  assert(actual === expected);
  assert.deepEqual(JSON.parse(actual), synthdef);
});


test("units", () => {
  const expected = `
{
  "name": "units",
  "consts": [],
  "units": [
    [ "A"  ,   1,   2, [ [ 0, 1 ]                                         ], [ 0 ] ],
    [ "BB" ,  10,  20, [ [ 0, 1 ], [ 2, 3 ], [ 4, 5 ], [ 6, 7 ], [ 8, 9 ] ], [ 1 ] ],
    [ "CCC", 100, 200, [ [ 0, 1 ], [ 2, 3 ]                               ], [   ] ]
  ]
}
`.trim();

  const synthdef = JSON.parse(expected);
  const actual = formatter.format(synthdef);

  assert(actual === expected);
  assert.deepEqual(JSON.parse(actual), synthdef);
});

test("infinity", () => {
  const expected = `
{
  "name": "units",
  "consts": [ "Infinity", "-Infinity" ],
  "paramValues": [ "Infinity", "-Infinity" ],
  "paramIndices": {
    "a": { "index": 0, "length": 1 },
    "b": { "index": 1, "length": 1 }
  },
  "units": [],
  "variants": {
    "alpha": [ "Infinity", "-Infinity" ],
    "beta" : [ "Infinity", "-Infinity" ]
  }
}
`.trim();

  const synthdef = JSON.parse(expected);

  synthdef.consts = synthdef.consts.map(x => +x);
  synthdef.paramValues = synthdef.paramValues.map(x => +x);
  toPairs(synthdef.variants).forEach((items) => {
    items[1] = items[1].map(x => +x);
  });

  const actual = formatter.format(synthdef);

  assert(actual === expected);
  assert.deepEqual(JSON.parse(actual), synthdef);
});

test("list", () => {
  const expected = `
[
  {
    "name": "empty",
    "consts": [],
    "units": []
  },
  {
    "name": "sine",
    "consts": [ 0 ],
    "paramValues": [ 0.5, 440 ],
    "paramIndices": {
      "amp" : { "index": 0, "length": 1 },
      "freq": { "index": 1, "length": 1 }
    },
    "units": [
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
]
`.trim();

  const synthdef = JSON.parse(expected);
  const actual = formatter.format(synthdef);

  assert(actual === expected);
  assert.deepEqual(JSON.parse(actual), synthdef);
});

# synthdef-json-formatter
[![Build Status](http://img.shields.io/travis/mohayonao/synthdef-json-formatter.svg?style=flat-square)](https://travis-ci.org/mohayonao/synthdef-json-formatter)
[![NPM Version](http://img.shields.io/npm/v/synthdef-json-formatter.svg?style=flat-square)](https://www.npmjs.org/package/synthdef-json-formatter)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

decode [SuperCollider Synth Definition File Format](http://doc.sccode.org/Reference/Synth-Definition-File-Format.html) and convert to JSON.

## Installation

```
npm install synthdef-json-formatter
```

## API

- `format(json: object): string`

## Example

```js
const formatter = require("synthdef-json-formatter");

const synthdef = {
  "name":"sine",
  "consts":[0],
  "paramValues":[0.5,440],
  "paramIndices":{"amp":{"index":0,"length":1},"freq":{"index":1,"length":1}},
  "specs":[["Control",1,0,[],[1,1]],["SinOsc",2,0,[[0,1],[-1,0]],[2]],["BinaryOpUGen",2,2,[[1,0],[0,0]],[2]],["Out",2,0,[[-1,0],[2,0],[2,0]],[]]],
  "variants":{"alpha":[0.25,880],"beta":[0.5,1760]}
};

console.log(formatter.format(synthdef));
```

```js
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
```

## License

MIT

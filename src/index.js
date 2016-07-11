"use strict";

const toPairs = require("lodash.topairs");
const unzip = require("lodash.unzip");
const zip = require("lodash.zip");

function format(synthdef) {
  return `
{
  "name": "${ synthdef.name }",
  "consts": ${ formatConsts(synthdef.consts) },
  "paramValues": ${ formatParamValues(synthdef.paramValues) },
  "paramIndices": ${ formatParamIndices(synthdef.paramIndices) },
  "specs": ${ formatSpec(synthdef.specs) },
  "variants": ${ formatVariants(synthdef.variants) }
}`.trim();
}

function spc(n) {
  return " ".repeat(n);
}

function clean(str) {
  return str.replace(/\[(\s+)\]/g, " $1 ").replace(/\s,/m, "  ").replace(/,(\s+)\]/m, " $1]");
}

function alignR(values) {
  const length = values.reduce((a, b) => Math.max(a, b.length), 0);

  return values.map(value => value + spc(length - value.length));
}

function alignL(values) {
  const length = values.reduce((a, b) => Math.max(a, b.length), 0);

  return values.map(value => spc(length - value.length) + value);
}

function alignN(values) {
  return zip(...unzip(values).map(x => alignL(x.map(toS)))).map(toAS).map(clean);
}

function toS(value) {
  if (typeof value === "undefined") {
    return "";
  }
  return JSON.stringify(value);
}

function toAS(values) {
  return `[ ${ values.join(", ") } ]`
}

function formatConsts(consts) {
  if (consts.length === 0) {
    return "[]";
  }
  return `[ ${ consts.map(toS).join(", ") } ]`;
}

function formatParamValues(paramValues) {
  if (paramValues.length === 0) {
    return "[]";
  }
  return `[ ${ paramValues.map(toS).join(", ") } ]`;
}

function formatParamIndices(paramIndices) {
  const pairs = toPairs(paramIndices);

  if (pairs.length === 0) {
    return "{}";
  }

  const o2a = ({ index, length })=> [ index, length ];
  const a2s = ([ index, length ]) => `{ "index": ${ index }, "length": ${ length } }`;
  const fmt = values => alignL(values.map(toS));
  const unzipped = unzip(pairs);
  const zipped = zip(
    alignR(unzipped[0].map(toS)),
    zip(...unzip(unzipped[1].map(o2a).map(fmt))).map(a2s)
  );

  return `{
${ zipped.map(([ key, values ]) => spc(4) + `${ key }: ${ values }`).join(",\n") }
  }`;
}

function formatSpec(specs) {
  if (specs.length === 0) {
    return "[]";
  }

  const fmt = values => JSON.parse(JSON.stringify(unzip(values)).replace(/null/g, "[]"));
  const unzipped = unzip(specs);
  const zipped = zip(
    alignR(unzipped[0].map(toS)),
    alignR(unzipped[1].map(toS)),
    alignR(unzipped[2].map(toS)),
    zip(...fmt(unzipped[3]).map(alignN)).map(toAS).map(clean),
    alignN(unzipped[4])
  );

  return `[
${ zipped.map(values => spc(4) + toAS(values)).join(",\n") }
  ]`;
}

function formatVariants(variants) {
  const pairs = toPairs(variants);

  if (pairs.length === 0) {
    return "{}";
  }

  const unzipped = unzip(pairs);
  const zipped = zip(
    alignR(unzipped[0].map(toS)),
    alignN(unzipped[1])
  );

  return `{
${ zipped.map(([ key, values ]) => spc(4) + `${ key }: ${ values }`).join(",\n") }
  }`;
}

module.exports = { format };

"use strict";

const toPairs = require("lodash.topairs");
const unzip = require("lodash.unzip");
const zip = require("lodash.zip");

function format(synthDef) {
  if (Array.isArray(synthDef)) {
    return `[
${ synthDef.map(synthDef => _format(synthDef, 2)).join(",\n") }
]`;
  }
  return _format(synthDef, 0);
}

function _format(synthDef, indent) {
  const lines = [];

  lines.push('{');
  lines.push(`_"name": "${ synthDef.name }",`);
  lines.push(`_"consts": ${ formatConsts(synthDef.consts) },`);
  if (synthDef.paramValues != null ) {
    lines.push(`_"paramValues": ${ formatParamValues(synthDef.paramValues) },`);
    lines.push(`_"paramIndices": ${ formatParamIndices(synthDef.paramIndices) },`);
  }

  if (synthDef.variants != null) {
    lines.push(`_"units": ${ formatUnits(synthDef.units) },`);
    lines.push(`_"variants": ${ formatVariants(synthDef.variants) }`);
  } else {
    lines.push(`_"units": ${ formatUnits(synthDef.units) }`);
  }
  lines.push(`}`);

  return lines.join("\n").replace(/^_*/gm, _ => spc(indent + _.length * 2));
}

function spc(n) {
  return " ".repeat(n);
}

function clean(str) {
  return str
    .replace(/\s,/g, "  ").replace(/,(\s+)\]/g, " $1]");
}

function clean2(str) {
  return str
    .replace(/\[(\s+)\]/g, " $1 ")
    .replace(/\s,/g, "  ").replace(/,(\s+)\]/g, " $1]");
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
  if (value === Infinity || value === -Infinity) {
    return '"' + value + '"';
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
  if (Array.isArray(paramIndices)) {
    return formatParamIndicesArray(paramIndices);
  }

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
${ zipped.map(([ key, values ]) => "__" + `${ key }: ${ values }`).join(",\n") }
  }`;
}

function formatParamIndicesArray(paramIndices) {
  if (paramIndices.length === 0) {
    return "[]";
  }

  const unzipped = [ "name", "index", "length" ].map((key) => {
    return paramIndices.map(paramIndex => paramIndex[key]);
  });
  const zipped = zip(
    alignR(unzipped[0].map(toS)),
    alignL(unzipped[1].map(toS)),
    alignL(unzipped[2].map(toS))
  );
  const a2s = ([ name, index, length ]) => {
    return `{ "name": ${ name }, "index": ${ index }, "length": ${ length } }`;
  };

  return `[
${ zipped.map(values => "__" + a2s(values)).join(",\n") }
  ]`;
}

function formatUnits(units) {
  if (units.length === 0) {
    return "[]";
  }

  const fmt = values => JSON.parse(JSON.stringify(unzip(values)).replace(/null/g, "[]"));
  const unzipped = unzip(units);
  const zipped = zip(
    alignR(unzipped[0].map(toS)),
    alignL(unzipped[1].map(toS)),
    alignL(unzipped[2].map(toS)),
    zip(...fmt(unzipped[3]).map(alignN)).map(toAS).map(clean2),
    alignN(unzipped[4])
  );

  return `[
${ zipped.map(values => "__" + toAS(values)).join(",\n") }
  ]`;
}

function formatVariants(variants) {
  if (Array.isArray(variants)) {
    return formatVariantsArray(variants);
  }

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
${ zipped.map(([ key, values ]) => "__" + `${ key }: ${ values }`).join(",\n") }
  }`;
}

function formatVariantsArray(variants) {
  if (variants.length === 0) {
    return "[]";
  }

  const unzipped = [ "name", "values" ].map((key) => {
    return variants.map(variant => variant[key]);
  });
  const zipped = zip(
    alignR(unzipped[0].map(toS)),
    alignN(unzipped[1])
  );
  const a2s = ([ name, values ]) => {
    return `{ "name": ${ name }, "values": ${ values } }`;
  };

  return `[
${ zipped.map(values => "__" + a2s(values)).join(",\n") }
  ]`;

}

module.exports = { format };

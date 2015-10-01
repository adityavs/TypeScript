//// [stringLiteralTypesOverloads02.ts]

function getFalsyPrimitive(x: "string"): string;
function getFalsyPrimitive(x: "number"): number;
function getFalsyPrimitive(x: "boolean"): boolean;
function getFalsyPrimitive(x: "boolean" | "string"): boolean | string;
function getFalsyPrimitive(x: "boolean" | "number"): boolean | number;
function getFalsyPrimitive(x: "number" | "string"): number | string;
function getFalsyPrimitive(x: "number" | "string" | "boolean"): number | string | boolean;
function getFalsyPrimitive(x: string) {
    if (x === "string") {
        return "";
    }
    if (x === "number") {
        return 0;
    }
    if (x === "boolean") {
        return false;
    }

    // Should be unreachable.
    throw "Invalid value";
}

namespace Consts1 {
    const EMPTY_STRING = getFalsyPrimitive("string");
    const ZERO = getFalsyPrimitive('number');
    const FALSE = getFalsyPrimitive("boolean");
}

const string: "string" = "string"
const number: "number" = "number"
const boolean: "boolean" = "boolean"

const stringOrNumber = string || number;
const stringOrBoolean = string || boolean;
const booleanOrNumber = number || boolean;
const stringOrBooleanOrNumber = stringOrBoolean || number;

namespace Consts2 {
    const EMPTY_STRING = getFalsyPrimitive(string);
    const ZERO = getFalsyPrimitive(number);
    const FALSE = getFalsyPrimitive(boolean);

    const a = getFalsyPrimitive(stringOrNumber);
    const b = getFalsyPrimitive(stringOrBoolean);
    const c = getFalsyPrimitive(booleanOrNumber);
    const d = getFalsyPrimitive(stringOrBooleanOrNumber);
}




//// [stringLiteralTypesOverloads02.js]
function getFalsyPrimitive(x) {
    if (x === "string") {
        return "";
    }
    if (x === "number") {
        return 0;
    }
    if (x === "boolean") {
        return false;
    }
    // Should be unreachable.
    throw "Invalid value";
}
var Consts1;
(function (Consts1) {
    var EMPTY_STRING = getFalsyPrimitive("string");
    var ZERO = getFalsyPrimitive('number');
    var FALSE = getFalsyPrimitive("boolean");
})(Consts1 || (Consts1 = {}));
var string = "string" = "string";
var number = "number" = "number";
var boolean = "boolean" = "boolean";
var stringOrNumber = string || number;
var stringOrBoolean = string || boolean;
var booleanOrNumber = number || boolean;
var stringOrBooleanOrNumber = stringOrBoolean || number;
var Consts2;
(function (Consts2) {
    var EMPTY_STRING = getFalsyPrimitive(string);
    var ZERO = getFalsyPrimitive(number);
    var FALSE = getFalsyPrimitive(boolean);
    var a = getFalsyPrimitive(stringOrNumber);
    var b = getFalsyPrimitive(stringOrBoolean);
    var c = getFalsyPrimitive(booleanOrNumber);
    var d = getFalsyPrimitive(stringOrBooleanOrNumber);
})(Consts2 || (Consts2 = {}));

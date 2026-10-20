"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const param_helper_1 = require("../../lib/param-helper");
chai.Assertion.addMethod("param", function (name, value = null) {
    const negate = chai.util.flag(this, "negate") || false;
    if (negate && value) {
        throw new chai.AssertionError("chai method param does not support negation");
    }
    const param = (0, param_helper_1.getParam)(this._obj, name);
    this.assert(param != null, `expected param '${name}' to exist`, `expected param '${name}' to not exist`, undefined);
    if (value) {
        this.assert(Cypress._.isEqual(param, value), `expected param '${name}' to equal #{exp} but got #{act}`, `expected param '${name}' to not equal #{exp}`, // Unreachable, negation is not supported
        value, param);
    }
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlSubject = urlSubject;
const util_1 = require("../util");
/**
 * Resolves the subject of the `param` and `params` commands to a chainable URL (or query) string:
 * the current location if there is no subject, otherwise the subject itself, its `url` property or its `toString()` result.
 */
function urlSubject(subject) {
    if (Cypress._.isNil(subject)) {
        return cy.location("search", util_1.NO_LOG);
    }
    else if (Cypress._.isObject(subject) &&
        Object.hasOwn(subject, "toString")) {
        return cy.wrap(subject.toString(), util_1.NO_LOG);
    }
    else if (Cypress._.isObject(subject) &&
        "url" in subject &&
        Object.hasOwn(subject, "url")) {
        return cy.wrap(String(subject.url), util_1.NO_LOG);
    }
    else if (Cypress._.isString(subject)) {
        return cy.wrap(subject, util_1.NO_LOG);
    }
    else {
        throw new Error(`Cannot get query parameter for ${subject}`);
    }
}

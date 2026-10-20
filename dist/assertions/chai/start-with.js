"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
chai.Assertion.addProperty("start", function () {
    return {
        with: (substring) => {
            this.assert(Cypress._.startsWith(this._obj, substring), "expected #{this} to start with #{exp}", "expected #{this} to not start with #{exp}", substring);
        },
    };
});

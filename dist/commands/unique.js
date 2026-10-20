"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
Cypress.Commands.add("unique", { prevSubject: true }, (subject, sorted = false) => {
    const log = (0, util_1.logCommand)("unique", {
        message: sorted ? "sorted" : "",
        consoleProps: { subject, sorted },
    });
    const uniqueValues = Cypress._.uniq(subject);
    // sortBy compares values directly, so numbers are not sorted as strings like Array.prototype.sort does
    const yielded = sorted ? Cypress._.sortBy(uniqueValues) : uniqueValues;
    (0, util_1.updateConsoleProps)(log, { yielded });
    return yielded;
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
Cypress.Commands.add("unique", { prevSubject: true }, (subject, sorted = false) => {
    const log = (0, util_1.logCommand)("unique", {
        message: sorted ? "sorted" : "",
        consoleProps: { subject, sorted },
    });
    const yielded = Cypress._.uniq(subject);
    if (sorted) {
        yielded.sort();
    }
    (0, util_1.updateConsoleProps)(log, (consoleProps) => {
        consoleProps.yielded = yielded;
    });
    return yielded;
});

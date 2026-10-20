"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const COMMAND_NAME = "unique";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, sorted = false) => {
    const log = (0, util_1.logCommand)(COMMAND_NAME, {
        message: sorted ? "sorted" : "",
        consoleProps: { subject, sorted },
    });
    const yielded = Cypress._.uniq(subject);
    if (sorted) {
        yielded.sort();
    }
    (0, util_1.updateConsoleProps)(log, { yielded });
    return yielded;
});

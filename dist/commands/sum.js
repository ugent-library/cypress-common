"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
Cypress.Commands.add("sum", { prevSubject: true }, (subject) => {
    const log = (0, util_1.logCommand)("sum", {
        message: [subject],
        consoleProps: { subject },
    });
    const yielded = Cypress._.reduce(subject, Cypress._.add, 0);
    (0, util_1.updateLogMessage)(log, yielded);
    (0, util_1.updateConsoleProps)(log, { result: yielded });
    return yielded;
});

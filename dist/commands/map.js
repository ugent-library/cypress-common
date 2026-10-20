"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
Cypress.Commands.add("map", { prevSubject: true }, (subject, iteratee) => {
    const log = (0, util_1.logCommand)("map", {
        message: [subject],
        consoleProps: { subject, iteratee },
    });
    const yielded = Cypress._.map(subject, Cypress._.iteratee(iteratee));
    (0, util_1.updateConsoleProps)(log, (consoleProps) => {
        consoleProps.yielded = yielded;
    });
    return yielded;
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
Cypress.Commands.add("at", { prevSubject: true }, (subject, index) => {
    const log = (0, util_1.logCommand)("at", {
        message: index,
        consoleProps: { subject, index },
    });
    const yielded = Cypress._.nth(subject, index);
    (0, util_1.updateConsoleProps)(log, (consoleProps) => {
        consoleProps.yielded = yielded;
    });
    return yielded;
});

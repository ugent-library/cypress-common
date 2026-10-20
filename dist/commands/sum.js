"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const COMMAND_NAME = "sum";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject) => {
    const log = (0, util_1.logCommand)(COMMAND_NAME, {
        message: [subject],
        consoleProps: { subject },
    });
    const yielded = Cypress._.reduce(subject, Cypress._.add, 0);
    (0, util_1.updateLogMessage)(log, yielded);
    (0, util_1.updateConsoleProps)(log, { result: yielded });
    return yielded;
});

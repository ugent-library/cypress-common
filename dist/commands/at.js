"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const COMMAND_NAME = "at";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, index) => {
    const log = (0, util_1.logCommand)(COMMAND_NAME, {
        message: index,
        consoleProps: { subject, index },
    });
    const yielded = Cypress._.nth(subject, index);
    (0, util_1.updateConsoleProps)(log, { yielded });
    return yielded;
});

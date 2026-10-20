"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const COMMAND_NAME = "map";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, iteratee) => {
    const log = (0, util_1.logCommand)(COMMAND_NAME, {
        message: [subject],
        consoleProps: { subject, iteratee },
    });
    const yielded = Cypress._.map(subject, Cypress._.iteratee(iteratee));
    (0, util_1.updateConsoleProps)(log, { yielded });
    return yielded;
});

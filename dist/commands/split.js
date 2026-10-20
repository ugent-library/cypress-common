"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const COMMAND_NAME = "split";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, separator = "", filterEmptyElements = false) => {
    const log = (0, util_1.logCommand)(COMMAND_NAME, {
        message: separator.toString(),
        consoleProps: {
            subject,
            separator: separator.toString(),
            "Filter empty elements": filterEmptyElements,
        },
    });
    let yielded = Cypress._.split(subject, separator);
    if (filterEmptyElements) {
        yielded = Cypress._.filter(yielded);
    }
    (0, util_1.updateConsoleProps)(log, { yielded });
    return yielded;
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
Cypress.Commands.add("split", { prevSubject: true }, (subject, separator = "", filterEmptyElements = false) => {
    const log = (0, util_1.logCommand)("split", {
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

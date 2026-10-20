"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const COMMAND_NAME = "attr";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, attributeName, value = null) => {
    if (value) {
        (0, util_1.logCommand)(COMMAND_NAME, {
            message: `${attributeName} = ${value}`,
            consoleProps: { attributeName, value },
            $el: subject,
        });
        subject.attr(attributeName, value);
        return subject;
    }
    else {
        const log = (0, util_1.logCommand)(COMMAND_NAME, {
            message: attributeName,
            consoleProps: { attributeName },
            $el: subject,
        });
        const yielded = subject.attr(attributeName);
        (0, util_1.updateConsoleProps)(log, { yielded });
        return yielded;
    }
});

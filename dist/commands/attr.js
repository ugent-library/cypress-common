"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
Cypress.Commands.add("attr", { prevSubject: true }, (subject, attributeName, value) => {
    if (value !== undefined) {
        (0, util_1.logCommand)("attr", {
            message: `${attributeName} = ${value}`,
            consoleProps: { attributeName, value },
            $el: subject,
        });
        subject.attr(attributeName, value);
        return subject;
    }
    else {
        const log = (0, util_1.logCommand)("attr", {
            message: attributeName,
            consoleProps: { attributeName },
            $el: subject,
        });
        const yielded = subject.attr(attributeName);
        (0, util_1.updateConsoleProps)(log, { yielded });
        return yielded;
    }
});

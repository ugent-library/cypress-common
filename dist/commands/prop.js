"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const COMMAND_NAME = "prop";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, propertyName, value) => {
    if (typeof propertyName === "object") {
        const log = (0, util_1.logCommand)(COMMAND_NAME, {
            consoleProps: { properties: propertyName },
            $el: subject,
        });
        (0, util_1.updateLogMessage)(log, propertyName);
        subject.prop(propertyName);
        return subject;
    }
    else if (value !== undefined) {
        (0, util_1.logCommand)(COMMAND_NAME, {
            message: `${propertyName} = ${value}`,
            consoleProps: { propertyName, value },
            $el: subject,
        });
        subject.prop(propertyName, value);
        return subject;
    }
    else {
        const log = (0, util_1.logCommand)(COMMAND_NAME, {
            message: propertyName,
            consoleProps: { propertyName },
            $el: subject,
        });
        const yielded = subject.prop(propertyName);
        (0, util_1.updateConsoleProps)(log, { yielded });
        return yielded;
    }
});

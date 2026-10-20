"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
Cypress.Commands.add("prop", { prevSubject: true }, (subject, propertyName, value = null) => {
    if (value) {
        (0, util_1.logCommand)("prop", {
            message: `${propertyName} = ${value}`,
            consoleProps: { propertyName, value },
            $el: subject,
        });
        subject.prop(propertyName, value);
        return subject;
    }
    else {
        const log = (0, util_1.logCommand)("prop", {
            message: propertyName,
            consoleProps: { propertyName },
            $el: subject,
        });
        const yielded = subject.prop(propertyName);
        (0, util_1.updateConsoleProps)(log, { yielded });
        return yielded;
    }
});

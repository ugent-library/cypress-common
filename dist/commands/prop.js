import { logCommand, updateConsoleProps, updateLogMessage, } from "../util/index.js";
const COMMAND_NAME = "prop";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, propertyName, value) => {
    if (typeof propertyName === "object") {
        const log = logCommand(COMMAND_NAME, {
            consoleProps: { properties: propertyName },
            $el: subject,
        });
        updateLogMessage(log, propertyName);
        subject.prop(propertyName);
        return subject;
    }
    else if (value !== undefined) {
        logCommand(COMMAND_NAME, {
            message: `${propertyName} = ${value}`,
            consoleProps: { propertyName, value },
            $el: subject,
        });
        subject.prop(propertyName, value);
        return subject;
    }
    else {
        const log = logCommand(COMMAND_NAME, {
            message: propertyName,
            consoleProps: { propertyName },
            $el: subject,
        });
        const yielded = subject.prop(propertyName);
        updateConsoleProps(log, { yielded });
        return yielded;
    }
});

import { logCommand, updateConsoleProps } from "../util/index.js";
const COMMAND_NAME = "prop";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, propertyName, value = null) => {
    if (value) {
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

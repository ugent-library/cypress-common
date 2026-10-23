import { logCommand, updateConsoleProps, updateLogMessage, } from "../util/index.js";
const COMMAND_NAME = "attr";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, attributeName, value) => {
    if (attributeName !== null && typeof attributeName === "object") {
        const log = logCommand(COMMAND_NAME, {
            consoleProps: { attributes: attributeName },
            $el: subject,
        });
        updateLogMessage(log, attributeName);
        subject.attr(attributeName);
        updateConsoleProps(log, { yielded: subject });
        return subject;
    }
    else if (value !== undefined) {
        const log = logCommand(COMMAND_NAME, {
            message: `${attributeName} = ${value}`,
            consoleProps: { attributeName, value },
            $el: subject,
        });
        subject.attr(attributeName, value);
        updateConsoleProps(log, { yielded: subject });
        return subject;
    }
    else {
        const log = logCommand(COMMAND_NAME, {
            message: attributeName,
            consoleProps: { attributeName },
            $el: subject,
        });
        const yielded = subject.attr(attributeName);
        updateConsoleProps(log, { yielded });
        return yielded;
    }
});

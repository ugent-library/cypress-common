import { logCommand, updateConsoleProps } from "../util/index.js";
const COMMAND_NAME = "attr";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, attributeName, value = null) => {
    if (value) {
        logCommand(COMMAND_NAME, {
            message: `${attributeName} = ${value}`,
            consoleProps: { attributeName, value },
            $el: subject,
        });
        subject.attr(attributeName, value);
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

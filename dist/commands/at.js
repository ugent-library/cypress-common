import { logCommand, updateConsoleProps } from "../util/index.js";
const COMMAND_NAME = "at";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, index) => {
    const log = logCommand(COMMAND_NAME, {
        message: index,
        consoleProps: { subject, index },
    });
    const yielded = Cypress._.nth(subject, index);
    updateConsoleProps(log, { yielded });
    return yielded;
});

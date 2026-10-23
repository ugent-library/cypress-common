import { logCommand, updateConsoleProps, updateLogMessage, } from "../util/index.js";
const COMMAND_NAME = "sum";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject) => {
    const log = logCommand(COMMAND_NAME, {
        message: [subject],
        consoleProps: { subject },
    });
    const yielded = Cypress._.reduce(subject, Cypress._.add, 0);
    updateLogMessage(log, yielded);
    updateConsoleProps(log, { result: yielded });
    return yielded;
});

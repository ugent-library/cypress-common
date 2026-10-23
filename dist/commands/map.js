import { logCommand, updateConsoleProps } from "../util/index.js";
const COMMAND_NAME = "map";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, iteratee) => {
    const log = logCommand(COMMAND_NAME, {
        message: [subject],
        consoleProps: { subject, iteratee },
    });
    const yielded = Cypress._.map(subject, Cypress._.iteratee(iteratee));
    updateConsoleProps(log, { yielded });
    return yielded;
});

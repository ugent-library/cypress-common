import { logCommand, updateConsoleProps } from "../util/index.js";
const COMMAND_NAME = "unique";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, sorted = false) => {
    const log = logCommand(COMMAND_NAME, {
        message: sorted ? "sorted" : "",
        consoleProps: { subject, sorted },
    });
    const yielded = Cypress._.uniq(subject);
    if (sorted) {
        yielded.sort();
    }
    updateConsoleProps(log, { yielded });
    return yielded;
});

import { logCommand, updateConsoleProps } from "../util/index.js";
const COMMAND_NAME = "split";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: true }, (subject, separator = "", filterEmptyElements = false) => {
    const log = logCommand(COMMAND_NAME, {
        message: separator.toString(),
        consoleProps: {
            subject,
            separator: separator.toString(),
            "Filter empty elements": filterEmptyElements,
        },
    });
    let yielded = Cypress._.split(subject, separator);
    if (filterEmptyElements) {
        yielded = Cypress._.filter(yielded);
    }
    updateConsoleProps(log, { yielded });
    return yielded;
});

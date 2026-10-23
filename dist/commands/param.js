import { getParam } from "../lib/param-helper.js";
import { urlSubject } from "../lib/url-subject.js";
import { logCommand, NO_LOG, updateConsoleProps, updateLogMessage, } from "../util/index.js";
const COMMAND_NAME = "param";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: "optional" }, (subject, name, defaultValue = null) => {
    const log = logCommand(COMMAND_NAME, {
        message: name,
        consoleProps: { name, default: defaultValue },
    });
    return urlSubject(subject).then((url) => {
        updateConsoleProps(log, { subject: url });
        const yielded = getParam(url, name);
        if (yielded) {
            updateLogMessage(log, yielded);
        }
        else if (defaultValue !== null) {
            updateLogMessage(log, `(default: ${defaultValue})`);
        }
        updateConsoleProps(log, { yielded });
        return cy.wrap(yielded || defaultValue, NO_LOG);
    });
});

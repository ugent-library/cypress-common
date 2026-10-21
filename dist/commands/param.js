"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const param_helper_1 = require("../lib/param-helper");
const util_1 = require("../util");
const url_subject_1 = require("../lib/url-subject");
const COMMAND_NAME = "param";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: "optional" }, (subject, name, defaultValue = null) => {
    const log = (0, util_1.logCommand)(COMMAND_NAME, {
        message: name,
        consoleProps: { name, default: defaultValue },
    });
    return (0, url_subject_1.urlSubject)(subject).then((url) => {
        (0, util_1.updateConsoleProps)(log, { subject: url });
        const yielded = (0, param_helper_1.getParam)(url, name);
        if (yielded) {
            (0, util_1.updateLogMessage)(log, yielded);
        }
        else if (defaultValue !== null) {
            (0, util_1.updateLogMessage)(log, `(default: ${defaultValue})`);
        }
        (0, util_1.updateConsoleProps)(log, { yielded });
        return cy.wrap(yielded || defaultValue, util_1.NO_LOG);
    });
});

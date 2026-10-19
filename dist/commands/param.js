"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const param_helper_1 = require("../helpers/chai/param-helper");
const url_subject_1 = require("./url-subject");
Cypress.Commands.add("param", { prevSubject: "optional" }, (subject, name, defaultValue = null) => {
    return (0, url_subject_1.urlSubject)(subject).then((url) => {
        const yielded = (0, param_helper_1.getParam)(url, name);
        Cypress.log({
            name: "param",
            message: [name, yielded || "(default)"],
            consoleProps: () => ({
                subject: url,
                name,
                yielded,
                default: defaultValue,
            }),
        });
        return cy.wrap(yielded || defaultValue, { log: false });
    });
});

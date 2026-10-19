"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_subject_1 = require("./url-subject");
Cypress.Commands.add("params", { prevSubject: "optional" }, (subject) => {
    return (0, url_subject_1.urlSubject)(subject).then((url) => {
        const paramsEntries = new URLSearchParams(url.slice(url.indexOf("?"))).entries();
        const yielded = [...paramsEntries].reduce((previous, [name, value]) => {
            const existing = previous[name];
            if (existing === undefined) {
                previous[name] = value;
            }
            else if (Array.isArray(existing)) {
                existing.push(value);
            }
            else {
                previous[name] = [existing, value];
            }
            return previous;
        }, {});
        Cypress.log({
            name: "params",
            message: [yielded],
            consoleProps: () => ({
                subject: url,
                yielded,
            }),
        });
        return yielded;
    });
});

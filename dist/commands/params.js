"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const url_subject_1 = require("./url-subject");
Cypress.Commands.add("params", { prevSubject: "optional" }, (subject) => {
    const log = (0, util_1.logCommand)("params");
    return (0, url_subject_1.urlSubject)(subject).then((url) => {
        (0, util_1.updateConsoleProps)(log, { subject: url });
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
        (0, util_1.updateLogMessage)(log, Object.keys(yielded).join(", "));
        (0, util_1.updateConsoleProps)(log, { yielded });
        return yielded;
    });
});

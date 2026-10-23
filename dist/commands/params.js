import { logCommand, updateConsoleProps, updateLogMessage, } from "../util/index.js";
import { urlSubject } from "../lib/url-subject.js";
import { getQuery } from "../lib/param-helper.js";
const COMMAND_NAME = "params";
Cypress.Commands.add(COMMAND_NAME, { prevSubject: "optional" }, (subject) => {
    const log = logCommand(COMMAND_NAME);
    return urlSubject(subject).then((url) => {
        updateConsoleProps(log, { subject: url });
        const paramsEntries = new URLSearchParams(getQuery(url)).entries();
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
        updateLogMessage(log, Object.keys(yielded));
        updateConsoleProps(log, { yielded });
        return yielded;
    });
});

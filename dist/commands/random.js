"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
Cypress.Commands.add("random", { prevSubject: true }, (subject, lower, upper) => {
    const log = (0, util_1.logCommand)("random", {
        consoleProps: { lower, upper, subject },
    });
    const { length, keyFn, inFn, itemFn } = determineSubjectOperators(subject);
    if (lower === undefined) {
        lower = 0;
        upper = length - 1;
    }
    else if (upper === undefined) {
        upper = lower;
        lower = 0;
    }
    const index = Cypress._.random(lower, upper);
    const key = keyFn(index);
    const yielded = inFn(index) ? itemFn(index) : null;
    (0, util_1.updateLogMessage)(log, `[${index}] => ${yielded}`);
    (0, util_1.updateConsoleProps)(log, { lower, upper, index, key, yielded });
    return yielded;
});
function determineSubjectOperators(subject) {
    if (subject && typeof subject === "object") {
        if (Array.isArray(subject)) {
            return {
                length: subject.length,
                keyFn: (i) => i,
                inFn: (i) => i in subject,
                itemFn: (i) => subject.at(i),
            };
        }
        else if (Cypress.dom.isJquery(subject)) {
            return {
                length: subject.length,
                keyFn: (i) => i,
                inFn: (i) => i >= 0 && i < subject.length,
                itemFn: (i) => subject[i],
            };
        }
        else if (subject instanceof Map) {
            const keys = Array.from(subject.keys());
            return {
                length: subject.size,
                keyFn: (i) => keys.at(i),
                inFn: (i) => subject.has(keys.at(i)),
                itemFn: (i) => subject.get(keys.at(i)),
            };
        }
        else if (isIterable(subject)) {
            // Sets and other iterables
            const array = Array.from(subject);
            return {
                length: array.length,
                keyFn: (i) => i,
                inFn: (i) => i in array,
                itemFn: (i) => array.at(i),
            };
        }
    }
    throw new Error("Invalid subject");
}
function isIterable(value) {
    return (Symbol.iterator in value && typeof value[Symbol.iterator] === "function");
}

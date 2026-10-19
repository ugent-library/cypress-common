"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Cypress.Commands.add("map", { prevSubject: true }, (subject, iteratee) => {
    const yielded = Cypress._.map(subject, Cypress._.iteratee(iteratee));
    Cypress.log({
        name: "map",
        message: [subject],
        consoleProps: () => ({
            subject,
            iteratee,
            yielded,
        }),
    });
    return yielded;
});

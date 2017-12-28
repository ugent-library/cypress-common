Cypress.Commands.add('map', { prevSubject: true }, (subject, iteratee) => {
    let result = Cypress._.map(subject, iteratee);

    Cypress.log({
        name: 'map',
        message: [subject],
        consoleProps: () => {
            return {
                subject: subject,
                iteratee: iteratee,
                result: result,
            };
        },
    });

    return cy.wrap(result, { log: false });
});

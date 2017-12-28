Cypress.Commands.add('sum', { prevSubject: true }, (subject) => {
    let result = Cypress._.reduce(subject, Cypress._.add, 0);

    Cypress.log({
        name: 'sum',
        message: [subject, result],
        consoleProps: () => {
            return {
                subject: subject,
                result: result,
            };
        },
    });

    return cy.wrap(result, { log: false });
});

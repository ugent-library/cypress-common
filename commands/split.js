Cypress.Commands.add('split', {prevSubject: true}, (subject, separator) => {
    let result = Cypress._.split(subject, separator);

    Cypress.log({
        name: 'split',
        message: [subject, separator, result],
        consoleProps: () => {
            return {
                subject: subject,
                separator: separator,
                result: result,
            };
        },
    });

    return cy.wrap(result, {log: false});
});

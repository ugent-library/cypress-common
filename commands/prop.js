Cypress.Commands.add('prop', { prevSubject: true }, function (subject, property) {
    // Initiate command log
    let consoleProps = {
        property: property,
    };

    let log = Cypress.log({
        name: 'prop',
        message: [property],
        consoleProps: () => {
            return consoleProps;
        },
    });

    return cy.wrap(subject.prop(property), { log: false })
        .then(function (result) {
            consoleProps.result = result;

            log.snapshot().end();
        });
});

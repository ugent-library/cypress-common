Cypress.Commands.add('random', { prevSubject: true }, (subject) => {
    cy.wrap(subject, { log: false })
        .then((items) => {
            let index = Cypress._.random(items.length - 1);
            let result = items[index];

            Cypress.log({
                name: 'random',
                message: [`[${index}] => ${result}`],
                consoleProps: () => {
                    return {
                        subject: subject,
                        index: index,
                        result: result,
                    };
                }
            });

            return result;
        });
});

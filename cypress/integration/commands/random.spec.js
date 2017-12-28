describe('The random command', function () {
    it('should return a random item of an array', function () {
        const list = [2, 8, 11, 28, 29, 33];

        cy.wrap(list)
            .random()
            .should('not.be.an', 'array')
            .should('not.be.an', 'object')
            .should(Cypress._.isInteger)
            .should('be.oneOf', list);
    });

    it('should return a random item of a jQuery object (wrapped again by cypress)', function () {
        cy.visit('http://google.com');

        cy.get('button, a').as('items')
            .its('length')
            .should('be.above', 5);

        cy.get('@items')
            .random()
            .should('be.an', 'object')
            .should('have.length', 1);

        cy.get('@items')
            .random()
            .invoke('prop', 'tagName')
            .should('be.oneOf', ['BUTTON', 'A']);
    });
});

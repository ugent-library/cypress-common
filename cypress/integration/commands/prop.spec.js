describe('The prop command', function () {
    it('should return a property from an object', function () {
        let someLink = '<a id="someLink" href="abc">test</a>';

        cy.visit('https://blank.org');

        cy.document().then(function (doc) {
            Cypress.$(someLink).appendTo(doc.body);
        });

        cy.get('#someLink').as('some-link')
            .prop('href')
            .should('eq', 'https://blank.org/abc');

        cy.get('@some-link')
            .prop('innerText')
            .should('eq', 'test');

        cy.get('@some-link')
            .prop('outerHTML')
            .should('eq', someLink);
    });
});

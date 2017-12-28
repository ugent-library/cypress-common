describe('The split command', function () {
    it('should work with a separator string', function () {
        cy.wrap('a,b,c,d,e')
            .split(',')
            .should('eql', ['a', 'b', 'c', 'd', 'e']);
    });

    it('should work with a separator RegExp', function () {
        cy.wrap('a§€b§çc§€d§çe')
            .split(/§[€ç]/)
            .should('eql', ['a', 'b', 'c', 'd', 'e']);
    });
});
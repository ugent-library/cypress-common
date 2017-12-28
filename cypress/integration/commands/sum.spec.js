describe('The sum command', function () {
    it('should return the sum of the subject elements', function () {
        cy.wrap([4, 2, 3, 1])
            .sum()
            .should('eq', 10);
    });

    it('should return 0 for an empty array', function () {
        cy.wrap([])
            .sum()
            .should('eq', 0);
    });
});
let expectAssertionErrorOnFail = (done, message) => {
    cy.on('fail', function (error) {
        expect(error.constructor.name).to.eq('AssertionError');
        expect(error.message).to.eq(message);

        done();
    });
};

describe('The additional chai helpers', function () {
    describe('The readonly property', function () {
        let $input;

        beforeEach(function () {
            $input = Cypress.$('<input />', { readonly: true });
        });

        describe('In regular mode', function () {
            it('should not throw when a field is readonly', function () {
                expect($input).to.be.readonly;
            });

            it('should throw when a field is not readonly', function (done) {
                $input.prop('readonly', false);

                expectAssertionErrorOnFail(done, 'expected \'<input>\' to be read-only');

                expect($input).to.be.readonly;
            });
        });

        describe('In negative mode', function () {
            it('should not throw when a field is not readonly', function () {
                $input.prop('readonly', false);

                expect($input).not.to.be.readonly;
            });

            it('should throw when a field is not readonly', function (done) {
                expectAssertionErrorOnFail(done, 'expected \'<input>\' to not be read-only');

                expect($input).not.to.be.readonly;
            });
        });
    });

    describe('The start.with method', function () {
        describe('In regular mode', function () {
            it('should not throw when string starts with substring', function () {
                expect('Abc123').to.start.with('Abc');
            });

            it('should throw when string does not start with substring', function (done) {
                expectAssertionErrorOnFail(done, 'expected \'Abc123\' to start with \'abc\'');

                expect('Abc123').to.start.with('abc');
            });
        });

        describe('In negative mode', function () {
            it('should not throw when string does not start with substring', function () {
                expect('Abc123').not.to.start.with('abc');
            });

            it('should throw when string starts with substring', function (done) {
                expectAssertionErrorOnFail(done, 'expected \'Abc123\' to not start with \'Abc\'');

                expect('Abc123').not.to.start.with('Abc');
            });
        });
    });

    describe('The end.with method', function () {
        describe('In regular mode', function () {
            it('should not throw when string ends with substring', function () {
                expect('123abC').to.end.with('abC');
            });

            it('should throw when string does not end with substring', function (done) {
                expectAssertionErrorOnFail(done, 'expected \'123abC\' to end with \'abc\'');

                expect('123abC').to.end.with('abc');
            });
        });

        describe('In negative mode', function () {
            it('should not throw when string does not end with substring', function () {
                expect('123abC').not.to.end.with('abc');
            });

            it('should throw when string ends with substring', function (done) {
                expectAssertionErrorOnFail(done, 'expected \'123abC\' to not end with \'abC\'');

                expect('123abC').not.to.end.with('abC');
            });
        });
    });

    describe('The inViewport method', function () {
        before(() => {
            let $element = Cypress.$(`<button id="test" style="position: absolute">Test</button>`);

            cy.document()
                .then(d => {
                    $element.appendTo(d.body);
                });
        })

        describe('In regular mode', function () {
            it('should not throw when element is in viewport', function () {
                cy.get('#test').invoke('css', 'top', '100px');

                cy.window()
                    .then(w => {
                        expect(Cypress.$('#test')).to.be.inViewport(w);
                    });
            });

            it('should throw when element is not in viewport', function (done) {
                cy.get('#test').invoke('css', 'top', '5000px');

                expectAssertionErrorOnFail(done, 'expected \'<button#test>\' to be visible inside viewport');

                cy.window()
                    .then(w => {
                        expect(Cypress.$('#test')).to.be.inViewport(w);
                    });
            });
        });

        describe('In negative mode', function () {
            it('should not throw when element is not in viewport', function () {
                cy.get('#test').invoke('css', 'top', '5000px');

                cy.window()
                    .then(w => {
                        expect(Cypress.$('#test')).to.not.be.inViewport(w);
                    });
            });

            it('should throw when element is in viewport', function (done) {
                cy.get('#test').invoke('css', 'top', '100px');

                expectAssertionErrorOnFail(done, 'expected \'<button#test>\' to not be visible inside viewport');

                cy.window()
                    .then(w => {
                        expect(Cypress.$('#test')).to.not.be.inViewport(w);
                    });
            });
        });
    });
});

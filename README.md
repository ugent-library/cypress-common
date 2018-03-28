[![Build Status](https://travis-ci.org/Universiteitsbibliotheek/cypress-common.svg?branch=master)](https://travis-ci.org/Universiteitsbibliotheek/cypress-common)

# Helper commands & functions for Cypress test projects

This project contains several comman [helper functions](helpers/) and [commands](commands/) that can be used in [Cypress.io](https://cypress.io) projects.

Follow these steps to use this project:

* Create a Cypress test project
* Add this project as an npm/yarn package (replace `<version>` with the desired git version tag):

  ```
  yarn add https://github.com/Universiteitsbibliotheek/cypress-common.git#<version>
  ```

* Import the desired functions/commands in your `cypress/support/index.js` file:

  ```
  import 'cypress-common/helpers/chai';
  import 'cypress-common/commands/map';
  ```

* Use the imported functions/commands in your integration tests.

## Commands

### [getQueryParameter(name)](commands/get-query-parameter.js)

Read a query parameter from the current location or from a chained string or object with `toString` method.

```
cy.getQueryParameter('search').should('eq', 'Wikipedia');
cy.get('iframe').its('src').getQueryParameter('viewMode').should('eq', 'embedded');
```

### [map(iteratee)](commands/map.js)

Maps a set of chained elements with a lodash iteratee.

```
cy.get('a').map('href'); // Yields an array of href attributes of each A-tag
cy.get('img').map(img => Math.max(img.height, img.width)); // Yields the maximum side size for each IMG-tag
```

### [prop(name)](commands/prop.js)

Invokes the jQuery [prop](https://api.jquery.com/prop/) method.

```
cy.get('img#logo').prop('src'); // Yields the src property value of the selected IMG
```

### [random()](commands/random.js)

Yields a random element from the list of chained elements.

```
cy.get('a').random(); // Yields a random A element
cy.wrap([1, 3, 5, 7, 9]).random(); // Yields an odd number between 0 and 10
```

### [split(delimiter)](commands/split.js)

Splits the subject string in multiple elements based on a delimiter.

```
cy.get('textarea#notes').invoke('val').split('\n'); // Yields an array of lines of a selected TEXTAREA
```

### [sum()](commands/sum.js)

Yields the (aggregate) sum of the chained elements.

```
cy.get('img').map('height').sum();
```

## Helpers

### [chai.js](helpers/chai.js)

A list of helper functions for Chai assertions:

* `readonly()`: Asserts that an HTML field is readonly
* `starts.with(<substring>)`: Asserts that a string starts with a substring
* `ends.with(<substring>)`: Asserts that a string ends with a substring
* `inViewport(<the window object>)`: Asserts that a DOM element is currently visible inside the browser viewport

These helpers can be used both as a Chai expectation:

```
expect('This is a test').to.end.with('a test');
expect(Cypress.$('#aButton')).to.be.inViewport(window);
```

or in the Cypress should notation:

```
cy.get('input#province').should('be.readonly');
cy.window().then(w => cy.get('#aButton').should('be.inViewport'));
```

All Chai helpers can also be inversed with the `.not` flag:

```
expect('This is a test').to.not.start.with('a test');
cy.get('input#name').should('not.be.readonly');
```

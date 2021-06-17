[![Build Status](https://travis-ci.com/ugent-library/cypress-common.svg?branch=master)](https://travis-ci.com/ugent-library/cypress-common)
[![cypress-common](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/dkufj2&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/dkufj2/runs)
![CodeQL](https://github.com/ugent-library/cypress-common/workflows/CodeQL/badge.svg)

# Helper commands & functions for Cypress test projects

This project contains several common [helper functions](helpers/) and [commands](commands/) that can be used in [Cypress.io](https://cypress.io) projects.

Follow these steps to use this project:

- Create a Cypress test project
- Add this project as an npm/yarn package (replace `<version>` with the desired git version tag):

  ```
  yarn add https://github.com/ugent-library/cypress-common.git#<version>
  ```

- Import the desired functions/commands in your `cypress/support/index.js` file:

  ```
  import 'cypress-common/helpers/chai';
  import 'cypress-common/commands/map';
  ```

- Use the imported functions/commands in your integration tests.

## Commands

### [param(name)](commands/param.js)

Read a query parameter from the current location or from a chained string or object with `toString` method.

```
cy.param('search').should('eq', 'Wikipedia');
cy.get('iframe').its('src').param('viewMode').should('eq', 'embedded');
```

### [map(iteratee)](commands/map.js)

Maps a set of chained elements with a lodash iteratee.

```
cy.get('a').map('href'); // Yields an array of href attributes of each A-tag
cy.get('img').map(img => Math.max(img.height, img.width)); // Yields the maximum side size for each IMG-tag
```

### [prop(name[, value])](commands/prop.js)

Invokes the jQuery [prop](https://api.jquery.com/prop/) method.

```
cy.get('img#logo').prop('src'); // Yields the src property value of the selected IMG
cy.get('img#logo').prop('alt', 'The corporate logo'); // Yields the selected IMG component
```

### [random([lower[, upper]])](commands/random.js)

Yields a random element from the list of chained elements.

```
cy.get('a').random(); // Yields a random A element
cy.wrap([1, 3, 5, 7, 9]).random(); // Yields an odd number between 0 and 10
cy.get('a').random(5); // Yields a random of the first 5 A elements
cy.get('a').random(10, 20); // Yields a random A element from the 10..20 range
cy.wrap([1, 2, 3]).random(4, 5); // Yields null
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

### [unique([sorted])](commands/sorted.js)

Yields the subject without duplictes. Use the `sorted` parameter to also sort the yielded array.

```
cy.get('a').map('href').unique(); // Find all unique hyperlinks on a page
```

## Helpers

### [chai.js](helpers/chai.js)

A list of helper functions for Chai assertions:

- `readonly()`: Asserts that an HTML field is readonly
- `starts.with(<substring>)`: Asserts that a string starts with a substring
- `ends.with(<substring>)`: Asserts that a string ends with a substring
- `have.param(<name>, <value>)`: Asserts that a URL string contains a query parameter with a value (value is optional)
- `inViewport(<the window object>)`: Asserts that a DOM element is currently visible inside the browser viewport

These helpers can be used both as a Chai expectation:

```
expect('This is a test').to.end.with('a test');
expect('https://www.google.com/search?query=abc123').to.have.param('query', 'abc123');
expect(Cypress.$('#aButton')).to.be.inViewport(window);
```

or in the Cypress should notation:

```
cy.get('input#province').should('be.readonly');
cy.location('href').should('have.param', 'query', 'abc123');
cy.window().then(w => cy.get('#aButton').should('be.inViewport'));
```

All Chai helpers can also be inversed with the `.not` flag:

```
expect('This is a test').to.not.start.with('a test');
expect('https://www.google.com/search?query=abc123').to.not.have.param('source');
cy.get('input#name').should('not.be.readonly');
```

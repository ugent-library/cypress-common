[![GitHub Action Cypress Tests](https://github.com/ugent-library/cypress-common/actions/workflows/main.yml/badge.svg)](https://github.com/ugent-library/cypress-common/actions/workflows/main.yml)
[![cypress-common](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/dkufj2&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/dkufj2/runs)
[![CodeQL](https://github.com/ugent-library/cypress-common/workflows/CodeQL/badge.svg)](https://github.com/ugent-library/cypress-common/actions/workflows/codeql-analysis.yml)

# Helper commands & functions for Cypress test projects

This project contains several common [helper functions](helpers/) and [commands](commands/) that can be used in [Cypress.io](https://cypress.io) projects.

Follow these steps to use this project:

- Create a Cypress test project
- Add this project as an npm/yarn package (replace `<version>` with the desired git version tag):

  ```sh
  yarn add https://github.com/ugent-library/cypress-common.git#<version>
  ```

- Import the desired functions/commands in your `cypress/support/index.js` file:

  ```sh
  import 'cypress-common/helpers/chai';
  import 'cypress-common/commands/map';
  ```

- Use the imported functions/commands in your tests.

## Commands

### [at(index)](commands/at.js)

Yields the element at index n (zero-based) of "array-likes". If n is negative, the n-th element from the end is yielded.

This command uses lodash's [nth](https://lodash.com/docs#nth) method under the hood, which is very similar to the vanilla [Array.prototype.at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) method but yields undefined instead of throwing when the subject is not an array-like.

```js
cy.get('img').at(2) // Yields the third image element
cy.get('a').prop('href').at(1) // Yields "t" (provided href is a URL that starts with "http")
cy.wrap([1, 2, 3, 4]).at(3) // Yields 4
cy.wrap([1, 2, 3, 4]).at(-1) // Yields 4
cy.wrap([1, 2, 3, 4]).at(10) // Yields undefined
cy.wrap({ abc: 123 }).at(4) // Yields undefined
```

### [attr(name[, value])](commands/attr.js)

Invokes the jQuery [attr](https://api.jquery.com/attr/) method.

```js
cy.get('img#logo').attr('src') // Yields the src attribute value of the selected IMG
cy.get('img#logo').attr('alt', 'The corporate logo') // Yields the selected IMG component
```

### [map(iteratee)](commands/map.js)

Maps a set of chained elements using a lodash iteratee.

```js
cy.get('a').map('href') // Yields an array of href attributes of each A-tag
cy.get('img').map(img => Math.max(img.height, img.width)) // Yields the maximum side size for each IMG-tag
cy.wrap([1, 2, 3]).map(i => i * i) // Yields [1, 4, 9]
```

### [param(name)](commands/param.js)

Read a query parameter from the current location or from a chained string or object with `toString` method.

```js
cy.param('search').should('eq', 'Wikipedia')
cy.get('iframe').its('src').param('viewMode').should('eq', 'embedded')
```

### [prop(name[, value])](commands/prop.js)

Invokes the jQuery [prop](https://api.jquery.com/prop/) method.

```ts
cy.get('img#logo').prop('src') // Yields the src property value of the selected IMG
cy.get('img#logo').prop<string>('src') // Typescript version of the line above
cy.get('img#logo').prop('alt', 'The corporate logo') // Yields the selected IMG component
```

### [random([[lower, ]upper])](commands/random.js)

Yields a random element from the list of chained elements.

```js
cy.get('a').random() // Yields a random A element
cy.wrap([1, 3, 5, 7, 9]).random() // Yields an odd number between 0 and 10
cy.get('a').random(5) // Yields a random of the first 5 A elements
cy.get('a').random(10, 20) // Yields a random A element from the 10..20 range
cy.wrap([1, 2, 3]).random(4, 5) // Yields null
```

### [split([delimiter = ''[, filterEmptyElements = false]])](commands/split.js)

Splits the subject string in multiple elements based on a delimiter.

```js
cy.get('textarea#notes').invoke('val').split('\n') // Yields an array of lines of a selected TEXTAREA
cy.wrap('abc def').split() // Yields ['a', 'b', 'c', ' ', 'd', 'e', 'f']
cy.location('pathname').split('/') // Eg.: ['', 'en', 'tags', 'foo', 'bar', '']
cy.location('pathname').split('/', true) // Eg.: ['en', 'tags', 'foo', 'bar']
```

### [sum()](commands/sum.js)

Yields the (aggregate) sum of the chained elements.

```js
cy.get('img').map('height').sum()
```

### [unique([sorted])](commands/sorted.js)

Yields the subject without any duplicates. Use the `sorted` parameter to also sort the yielded array.

```js
cy.get('a').map('href').unique() // Find all unique hyperlinks on a page
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

```js
expect('This is a test').to.end.with('a test')
expect('https://www.google.com/search?query=abc123').to.have.param('query', 'abc123')
expect(Cypress.$('#aButton')).to.be.inViewport(window)
```

or in the Cypress should notation:

```js
cy.get('input#province').should('be.readonly')
cy.location('href').should('have.param', 'query', 'abc123')
cy.window().then(w => cy.get('#aButton').should('be.inViewport'))
```

All Chai helpers can also be inversed with the `.not` flag:

```js
expect('This is a test').to.not.start.with('a test')
expect('https://www.google.com/search?query=abc123').to.not.have.param('source')
cy.get('input#name').should('not.be.readonly')
```

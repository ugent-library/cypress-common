[![GitHub Action Cypress Tests](https://github.com/ugent-library/cypress-common/actions/workflows/main.yml/badge.svg)](https://github.com/ugent-library/cypress-common/actions/workflows/main.yml)
[![cypress-common](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/dkufj2&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/dkufj2/runs)
[![CodeQL](https://github.com/ugent-library/cypress-common/workflows/CodeQL/badge.svg)](https://github.com/ugent-library/cypress-common/actions/workflows/codeql-analysis.yml)

# Common commands & assertion chainers for Cypress test projects

This project contains several common [assertion chainers](src/assertions/) and [commands](src/commands/) that can be used in [Cypress.io](https://cypress.io) projects, plus [utility functions](src/util/) for logging your own custom commands.

Follow these steps to use this project:

- Create a Cypress test project
- Add this project as an npm/yarn package (replace `<version>` with the desired git version tag):

  ```sh
  npm install https://github.com/ugent-library/cypress-common.git#v<version>
  ```

- Import the desired assertions/commands in your `cypress/support/e2e.ts` file:

  ```ts
  import 'cypress-common/assertions/chai';
  import 'cypress-common/commands/map';
  ```

- Use the imported assertions/commands in your tests.

## Commands

### [at(index)](src/commands/at.ts)

Yields the element at index n (zero-based) of "array-likes". If n is negative, the n-th element from the end is yielded.

This command uses lodash's [nth](https://lodash.com/docs#nth) method under the hood, which is very similar to the vanilla [Array.prototype.at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) method but yields undefined instead of throwing when the subject is not an array-like.

```js
cy.get("img").at(2); // Yields the third image element
cy.get("a").prop("href").at(1); // Yields "t" (provided href is a URL that starts with "http")
cy.wrap([1, 2, 3, 4]).at(3); // Yields 4
cy.wrap([1, 2, 3, 4]).at(-1); // Yields 4
cy.wrap([1, 2, 3, 4]).at(10); // Yields undefined
cy.wrap({ abc: 123 }).at(4); // Yields undefined
```

### [attr(name[, value])](src/commands/attr.ts)

Invokes the jQuery [attr](https://api.jquery.com/attr/) method.

```js
cy.get("img#logo").attr("src"); // Yields the src attribute value of the selected IMG
cy.get("img#logo").attr("alt", "The corporate logo"); // Yields the selected IMG component
```

### [map(iteratee)](src/commands/map.ts)

Maps a set of chained elements using a lodash iteratee.

```js
cy.get("a").map("href"); // Yields an array of href attributes of each A-tag
cy.get("img").map((img) => Math.max(img.height, img.width)); // Yields the maximum side size for each IMG-tag
cy.wrap([1, 2, 3]).map((i) => i * i); // Yields [1, 4, 9]
```

### [param(name[, defaultValue])](src/commands/param.ts)

Read a query parameter from the current location or from a chained string or object with `toString` method.

```js
cy.param("search").should("eq", "Wikipedia");
cy.param("noExistingParam", "other").should("eq", "other");
cy.get("iframe").its("src").param("viewMode").should("eq", "embedded");
```

### [params()](src/commands/params.ts)

Yields an object representing the search query.

```js
cy.params().should("eql", { search: "Wikipedia" });
cy.get("iframe").its("src").params().should("eql", { viewMode: "embedded" });
cy.wrap("https://example.com?name=John&name=Doe&age=49")
  .params()
  .should("eql", { name: ["John", "Doe"], age: "49" });
```

### [prop(name[, value])](src/commands/prop.ts)

Invokes the jQuery [prop](https://api.jquery.com/prop/) method.

```ts
cy.get("img#logo").prop("src"); // Yields the src property value of the selected IMG
cy.get("img#logo").prop<string>("src"); // Typescript version of the line above
cy.get("img#logo").prop("alt", "The corporate logo"); // Yields the selected IMG component
```

### [random([[lower, ]upper])](src/commands/random.ts)

Yields a random element from the list of chained elements.

```js
cy.get("a").random(); // Yields a random A element
cy.wrap([1, 3, 5, 7, 9]).random(); // Yields an odd number between 0 and 10
cy.get("a").random(5); // Yields a random of the first 5 A elements
cy.get("a").random(10, 20); // Yields a random A element from the 10..20 range
cy.wrap([1, 2, 3]).random(4, 5); // Yields null
```

### [split([delimiter = ''[, filterEmptyElements = false]])](src/commands/split.ts)

Splits the subject string in multiple elements based on a delimiter.

```js
cy.get("textarea#notes").invoke("val").split("\n"); // Yields an array of lines of a selected TEXTAREA
cy.wrap("abc def").split(); // Yields ['a', 'b', 'c', ' ', 'd', 'e', 'f']
cy.location("pathname").split("/"); // Eg.: ['', 'en', 'tags', 'foo', 'bar', '']
cy.location("pathname").split("/", true); // Eg.: ['en', 'tags', 'foo', 'bar']
```

### [sum()](src/commands/sum.ts)

Yields the (aggregate) sum of the chained elements.

```js
cy.get("img").map("height").sum();
```

### [unique([sorted])](src/commands/unique.ts)

Yields the subject without any duplicates. Use the `sorted` parameter to also sort the yielded array.

```js
cy.get("a").map("href").unique(); // Find all unique hyperlinks on a page
```

## Assertions

### [chai](src/assertions/chai/)

Custom Chai assertions added by this package:

- `readonly()`: Asserts that an HTML field is readonly
- `starts.with(<substring>)`: Asserts that a string starts with a substring
- `ends.with(<substring>)`: Asserts that a string ends with a substring
- `have.param(<name>, <value>)`: Asserts that a URL string contains a query parameter with a value (value is optional)
- `inViewport(<the window object>)`: Asserts that a DOM element is currently visible inside the browser viewport

These chainers can be used both as a Chai expectation:

```js
expect("This is a test").to.end.with("a test");
expect("https://www.google.com/search?query=abc123").to.have.param(
  "query",
  "abc123",
);
expect(Cypress.$("#aButton")).to.be.inViewport(window);
```

or in the Cypress should notation:

```js
cy.get("input#province").should("be.readonly");
cy.location("href").should("have.param", "query", "abc123");
cy.window().then((w) => cy.get("#aButton").should("be.inViewport"));
```

All Chai chainers can also be inversed with the `.not` flag:

```js
expect("This is a test").to.not.start.with("a test");
expect("https://www.google.com/search?query=abc123").to.not.have.param(
  "source",
);
cy.get("input#name").should("not.be.readonly");
```

## Utils

The [`cypress-common/util`](src/util/) module contains helper functions to log your own custom commands in the Cypress command log, the same way the commands in this package do.

The recommended pattern is to create the log entry as the first statement of a command and to add data to it as it becomes available. That way the command still shows up in the command log, with everything known so far, when it fails halfway.

```ts
import {
  addToLog,
  logCommand,
  NO_LOG,
  updateConsoleProps,
} from "cypress-common/util";

Cypress.Commands.add(
  "getURLParam",
  { prevSubject: "optional" },
  (subject: string | undefined, name: string) => {
    const log = logCommand("getURLParam", {
      message: name,
      consoleProps: { name },
    });

    return cy
      .location("href", NO_LOG)
      .then((href) => {
        updateConsoleProps(log, { href });

        return new URL(subject ?? href).searchParams.get(name);
      })
      .then(addToLog(log, "yielded"));
  },
);
```

All functions that take a `log` do nothing if it is `undefined`. This happens when Cypress hides the log entry, and it also lets you turn logging off yourself, e.g. `const log = options.log !== false ? logCommand(...) : undefined`.

### [NO_LOG](src/util/index.ts)

Options object to suppress logging of the Cypress commands used inside your own command.

```ts
cy.wrap(subject, NO_LOG);
cy.location("search", NO_LOG);
```

### [logCommand(name[, options])](src/util/index.ts)

Creates a command log entry and returns it. The display name is derived from the camelCase command name: `"uniqueValues"` is shown as `UNIQUE VALUES`, `"getURLParam"` as `GET URL PARAM`.

Options:

- `message`: the message shown in the command log
- `consoleProps`: the initial console props, shown in the browser console when clicking the log entry
- `$el`: an element to highlight when the log entry is selected

```ts
const log = logCommand("attr", {
  message: name,
  consoleProps: { name },
  $el: subject,
});
```

### [updateLogMessage(log, append[, separator = ", "])](src/util/index.ts)

Appends a value to the message of a log entry. Arrays are formatted as `[a, b]` and cut off with `...` once their items exceed 50 characters. Other values are converted with `String()`.

```ts
const log = logCommand("param", { message: "page" });

updateLogMessage(log, 2); // Message is now "page, 2"
updateLogMessage(log, ["a", "b"]); // Message is now "page, 2, [a, b]"
```

### [updateConsoleProps(log, update)](src/util/index.ts)

Updates the console props of a log entry created with `logCommand`. Pass an object to add or overwrite console props, or a callback that receives the console props object and may mutate it.

```ts
updateConsoleProps(log, { index, yielded });

updateConsoleProps(log, (consoleProps) => {
  consoleProps.attempts.push(attempt);
});
```

### [addToConsoleProps(log, propertyKey)](src/util/index.ts)

Creates a `.then()` callback that adds the yielded value to the console props under `propertyKey` and yields it unchanged.

```ts
cy.wrap(subject, NO_LOG)
  .invoke(NO_LOG, "attr", name)
  .then(addToConsoleProps(log, "yielded"));
```

### [addToLog(log, propertyKey[, separator = ", "])](src/util/index.ts)

Like `addToConsoleProps`, but also appends the yielded value to the log message if it is a non-empty string, a number or a boolean, or an array of those.

```ts
const log = logCommand("param", { message: name, consoleProps: { name } });

cy.location("search", NO_LOG)
  .then((search) => new URLSearchParams(search).get(name))
  .then(addToLog(log, "yielded", "=")); // With name "page" and "?page=2", the message becomes "page=2"
```

declare global {
  namespace Chai {
    interface Assertion {
      /**
       * Asserts that a DOM element is currently visible inside the browser viewport.
       *
       * @param window
       */
      inViewport(window: Window): void;
    }
  }
}

chai.Assertion.addMethod("inViewport", function (window: Window) {
  if (window?.constructor.name !== "Window") {
    throw new Error(
      'You should provide the window object, retrieved by "cy.window()", as an argument to the "inViewport" assertion.',
    );
  }

  let el: Element | JQuery = this._obj;

  if ("jquery" in el) {
    const [element] = el;

    if (el.length !== 1 || element === undefined) {
      throw new Error(
        'The "inViewport" assertion cannot be used on multiple elements.',
      );
    }

    el = element;
  }

  const rect = el.getBoundingClientRect();

  const visible =
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || window.document.documentElement.clientHeight) &&
    rect.right <=
      (window.innerWidth || window.document.documentElement.clientWidth);

  this.assert(
    visible,
    "expected #{this} to be visible inside viewport",
    "expected #{this} to not be visible inside viewport",
    undefined,
  );
});

export {};

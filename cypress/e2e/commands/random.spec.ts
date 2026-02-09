describe("The random command", () => {
  // [100 ... 1]
  const list = Array.from(Array(100).keys()).map((k) => 100 - k);

  it("should return a random item of an array", () => {
    cy.wrap(list)
      .random()
      .should("not.be.an", "array")
      .should("not.be.an", "object")
      .should(Cypress._.isInteger)
      .should("be.oneOf", list);
  });

  it("should return a random item of a set", () => {
    cy.wrap(new Set(["A", "B", "C", "D", "E"]))
      .random()
      .should("not.be.an", "array")
      .should("not.be.an", "object")
      .should("be.oneOf", ["A", "B", "C", "D", "E"]);
  });

  it("should return a random item of a map", () => {
    cy.wrap(new Map(list.map((i) => [i.toString(), i])))
      .random()
      .should("not.be.an", "array")
      .should("not.be.an", "object")
      .should(Cypress._.isInteger)
      .should("be.oneOf", list);
  });

  it("should return a random item of a custom iterable", () => {
    const iterable = {
      [Symbol.iterator]: function* () {
        for (let i of list) {
          yield i;
        }
      },
    };

    cy.wrap(iterable)
      .random()
      .should("not.be.an", "array")
      .should("not.be.an", "object")
      .should(Cypress._.isInteger)
      .should("be.oneOf", list);
  });

  it("should return a random item of a jQuery object (wrapped again by cypress)", () => {
    cy.origin("https://lib.ugent.be", () => {
      Cypress.require("../../../commands/random");

      cy.visit("/en/libraries");

      cy.get("img, a").as("items").its("length").should("be.above", 30);

      cy.get("@items")
        .random()
        .should("be.an", "object")
        .should("have.length", 1);

      cy.get("@items")
        .random()
        .invoke("prop", "tagName")
        .should("be.oneOf", ["IMG", "A"]);
    });
  });

  it("should be possible to pass an upper bound", () => {
    for (let i = 0; i < 100; i++) {
      cy.wrap(list).random(10).should("be.within", 90, 100);
    }
  });

  it("should be possible to pass a lower and upper bound", () => {
    for (let i = 0; i < 100; i++) {
      cy.wrap(list).random(10, 20).should("be.within", 80, 90);
    }
  });

  it("should yield null if the lower and upper parameters are out of the array bounds", () => {
    cy.wrap(list).random(100, 105).should("be.null");
  });

  it("should yield null if the source array is empty", () => {
    cy.wrap([]).random().should("be.null");
  });
});

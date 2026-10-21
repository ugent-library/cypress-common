describe("The prop command", () => {
  const someLink =
    '<a id="someLink" href="abc" title="the title" data-id="987" data-type="link">test</a>';
  const someMeter =
    '<meter id="someMeter" min="0" max="123" value="75">75%</meter>';
  const someCheckbox = '<input id="someCheckbox" type="checkbox" checked>';

  beforeEach(() => {
    cy.visit("/en/libraries");

    cy.document().then((doc) => {
      Cypress.$(someLink).appendTo(doc.body);
      Cypress.$(someMeter).appendTo(doc.body);
      Cypress.$(someCheckbox).appendTo(doc.body);
    });
  });

  it("should return a property from an object", () => {
    cy.get("#someLink")
      .as("some-link")
      .prop<string>("href")
      .should("eq", "https://lib.ugent.be/en/libraries/abc");

    cy.get("@some-link").prop<string>("innerText").should("eq", "test");

    cy.get("@some-link").prop<string>("outerHTML").should("eq", someLink);

    cy.get("@some-link")
      .prop<DOMStringMap>("dataset")
      .then((dataset) => ({ ...dataset })) // Convert DOMStringMap to a plain object
      .should("eql", { id: "987", type: "link" });

    cy.get("#someMeter")
      .as("some-meter")
      .prop("max")
      .should("be.a", "number")
      .should("eq", 123);
    cy.get("@some-meter").prop<number>("max").should("eq", 123);
  });

  it("should be possible to set a property on an object", () => {
    cy.get("#someLink")
      .as("some-link")
      .prop<string>("title", "some other title")
      .prop<string>("href", "/def");

    cy.get("@some-link").should((sl) => {
      // Check the DOM way
      expect(sl.get(0)).to.have.property("title", "some other title");
      expect(sl.get(0)).to.have.property("href", "https://lib.ugent.be/def");

      // Check the JQuery way
      expect(sl.prop("title")).to.eq("some other title");
      expect(sl.prop("href")).to.eq("https://lib.ugent.be/def");
    });

    cy.get("@some-link").prop<string>("title").should("eq", "some other title");
    cy.get("@some-link")
      .prop<string>("href")
      .should("eq", "https://lib.ugent.be/def");

    // Update a numeric property
    cy.get("#someMeter").as("some-meter").prop<number>("max", 456);

    cy.get("@some-meter").should((sl) => {
      // Check the DOM way
      expect(sl.get(0)).to.have.property("max", 456);

      // Check the JQuery way
      expect(sl.prop("max")).to.eq(456);
    });

    cy.get("@some-meter").prop<number>("max").should("eq", 456);
  });

  it("should be possible to set a falsy property value", () => {
    cy.get("#someCheckbox")
      .as("some-checkbox")
      .prop("checked", false)
      .should("have.id", "someCheckbox");

    cy.get("@some-checkbox").should("not.be.checked");
    cy.get("@some-checkbox").prop("checked").should("be.false");

    cy.get("#someMeter")
      .as("some-meter")
      .prop("max", 0)
      .should("have.id", "someMeter");

    cy.get("@some-meter").prop("max").should("eq", 0);

    cy.get("#someLink")
      .as("some-link")
      .prop("title", "")
      .should("have.id", "someLink");

    cy.get("@some-link").prop("title").should("eq", "");
  });
});

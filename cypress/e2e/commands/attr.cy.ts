describe("The attr command", () => {
  const someLink =
    '<a id="someLink" href="abc" title="the title" data-id="987" data-type="link">test</a>';

  beforeEach(() => {
    cy.visit("/");

    cy.document().then((doc) => {
      Cypress.$(someLink).appendTo(doc.body);
    });
  });

  it("should return a attribute from an object", () => {
    cy.get("#someLink").as("some-link").attr("href").should("eq", "abc");

    cy.get("@some-link").attr("title").should("eq", "the title");

    cy.get("@some-link").attr("data-id").should("eq", "987");
    cy.get("@some-link").attr("data-type").should("eq", "link");
  });

  it("should be possible to set a attribute on an object", () => {
    cy.get("#someLink")
      .as("some-link")
      .attr("title", "some other title")
      .attr("href", "/def");

    cy.get("@some-link").should((sl) => {
      // Check the DOM way
      expect(sl.get(0)).to.have.attr("title", "some other title");
      expect(sl.get(0)).to.have.attr("href", "/def");

      // Check the JQuery way
      expect(sl.attr("title")).to.eq("some other title");
      expect(sl.attr("href")).to.eq("/def");
    });

    cy.get("@some-link").attr("title").should("eq", "some other title");

    cy.get("@some-link").attr("href").should("eq", "/def");
  });

  it("should be possible to set a falsy attribute value", () => {
    cy.get("#someLink")
      .as("some-link")
      .attr("tabindex", 0)
      .should("have.id", "someLink");

    cy.get("@some-link").should("have.attr", "tabindex", "0");
    cy.get("@some-link").attr("tabindex").should("eq", "0");

    cy.get("@some-link").attr("title", "").should("have.id", "someLink");

    cy.get("@some-link").should("have.attr", "title", "");
    cy.get("@some-link").attr("title").should("eq", "");
  });

  it("should remove an attribute when setting it to null", () => {
    cy.get("#someLink")
      .as("some-link")
      .attr("title", null)
      .should("have.id", "someLink");

    cy.get("@some-link").should("not.have.attr", "title");
  });
});

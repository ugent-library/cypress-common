describe("The attr command", () => {
  const someLink =
    '<a id="someLink" href="abc" title="the title" data-id="987" data-type="link">test</a>';

  beforeEach(() => {
    cy.origin("https://lib.ugent.be", { args: someLink }, (someLink) => {
      Cypress.require("../../../commands/attr");

      cy.visit("/en/libraries");

      cy.document().then((doc) => {
        Cypress.$(someLink).appendTo(doc.body);
      });
    });
  });

  it("should return a attribute from an object", () => {
    cy.origin("https://lib.ugent.be", () => {
      cy.get("#someLink").as("some-link").attr("href").should("eq", "abc");

      cy.get("@some-link").attr("title").should("eq", "the title");

      cy.get("@some-link").attr("data-id").should("eq", "987");
      cy.get("@some-link").attr("data-type").should("eq", "link");
    });
  });

  it("should be possible to set a attribute on an object", () => {
    cy.origin("https://lib.ugent.be", () => {
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
  });
});

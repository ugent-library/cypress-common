describe("The params command", () => {
  const query = "?q=test%20search&item=abc&count=123&item=def";
  const url = "https://lib.ugent.be/" + query;

  describe("When chained directly of cy", () => {
    beforeEach(() => {
      cy.origin("https://lib.ugent.be", { args: url }, (url) => {
        Cypress.require("../../../commands/params");

        cy.visit(url);
      });
    });

    it("should use the current location", () => {
      cy.origin("https://lib.ugent.be", () => {
        cy.params().should("eql", {
          q: "test search",
          item: ["abc", "def"],
          count: "123",
        });
      });
    });
  });

  describe("When used on a subject with a toString method", () => {
    let subj: { propA: number; propB: boolean; toString: () => string };

    beforeEach(() => {
      subj = {
        propA: 1,
        propB: true,
        toString: () => query,
      };
    });

    it("should invoke the toString method", () => {
      cy.wrap(subj)
        .params()
        .should("eql", {
          q: "test search",
          item: ["abc", "def"],
          count: "123",
        });
    });

    it("should invoke the toString method (full url)", () => {
      subj.toString = () => url;

      cy.wrap(subj)
        .params()
        .should("eql", {
          q: "test search",
          item: ["abc", "def"],
          count: "123",
        });
    });
  });

  describe("When used on a subject with a url property", () => {
    let subj: { propA: number; url: string; propB: boolean };

    beforeEach(() => {
      subj = {
        propA: 1,
        url: query,
        propB: true,
      };
    });

    it("should get the url property", () => {
      cy.wrap(subj)
        .params()
        .should("eql", {
          q: "test search",
          item: ["abc", "def"],
          count: "123",
        });
    });

    it("should get the url property (full url)", () => {
      subj.url = url;

      cy.wrap(subj)
        .params()
        .should("eql", {
          q: "test search",
          item: ["abc", "def"],
          count: "123",
        });
    });
  });

  describe("When used on a string subject", () => {
    it("should use the string as subject", () => {
      cy.wrap(query)
        .params()
        .should("eql", {
          q: "test search",
          item: ["abc", "def"],
          count: "123",
        });
    });

    it("should use the string as subject (full url)", () => {
      cy.wrap(url)
        .params()
        .should("eql", {
          q: "test search",
          item: ["abc", "def"],
          count: "123",
        });
    });
  });

  describe("The alternate flow", () => {
    const assertFailure = (
      done: Mocha.Done,
      subject: string | number | boolean,
    ) => {
      cy.on("fail", (error) => {
        expect(error.constructor.name).to.eq("Error");
        expect(error.message).to.eq(
          `Cannot get query parameter for ${subject}`,
        );

        done();
      });
    };

    it("should throw an error if subject is a number", (done) => {
      assertFailure(done, 123);

      cy.wrap(123).params();
    });

    it("should throw an error if subject is a boolean", (done) => {
      assertFailure(done, true);

      cy.wrap(true).params();
    });

    it("should throw an error if subject is an object without toString method and url property", (done) => {
      assertFailure(done, "[object Object]");

      cy.wrap({ propA: 123, propB: false }).params();
    });
  });
});

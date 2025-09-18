describe("The param command", () => {
  const query = "/en/libraries?q=test%20search&item=abc&count=123&item=def";
  const url = "https://lib.ugent.be/" + query;

  describe("When chained directly of cy", () => {
    beforeEach(() => {
      cy.origin("https://lib.ugent.be", { args: url }, (url) => {
        Cypress.require("../../../commands/param");

        cy.visit(url);
      });
    });

    it("should use the current location", () => {
      cy.origin("https://lib.ugent.be", () => {
        cy.param("q").should("eq", "test search");
        cy.param("item").should("eql", ["abc", "def"]);
        cy.param("count").should("eq", "123");
      });
    });

    it("should return the default for an unknown parameter", () => {
      cy.origin("https://lib.ugent.be", () => {
        cy.param("wrong", "abc123").should("eq", "abc123");

        cy.param("wrong").should("be.null");
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
      cy.wrap(subj).param("q").should("eq", "test search");

      cy.wrap(subj).param("item").should("eql", ["abc", "def"]);

      cy.wrap(subj).param("count").should("eq", "123");
    });

    it("should invoke the toString method (full url)", () => {
      subj.toString = () => url;

      cy.wrap(subj).param("q").should("eq", "test search");

      cy.wrap(subj).param("item").should("eql", ["abc", "def"]);

      cy.wrap(subj).param("count").should("eq", "123");
    });

    it("should return the default for an unknown parameter", () => {
      cy.wrap(subj).param("wrong", "abc123").should("eq", "abc123");

      cy.wrap(subj).param("wrong").should("be.null");
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
      cy.wrap(subj).param("q").should("eq", "test search");

      cy.wrap(subj).param("item").should("eql", ["abc", "def"]);

      cy.wrap(subj).param("count").should("eq", "123");
    });

    it("should get the url property (full url)", () => {
      subj.url = url;

      cy.wrap(subj).param("q").should("eq", "test search");

      cy.wrap(subj).param("item").should("eql", ["abc", "def"]);

      cy.wrap(subj).param("count").should("eq", "123");
    });

    it("should return the default for an unknown parameter", () => {
      cy.wrap(subj).param("wrong", "abc123").should("eq", "abc123");

      cy.wrap(subj).param("wrong").should("be.null");
    });
  });

  describe("When used on a string subject", () => {
    it("should use the string as subject", () => {
      cy.wrap(query).param("q").should("eq", "test search");

      cy.wrap(query).param("item").should("eql", ["abc", "def"]);

      cy.wrap(query).param("count").should("eq", "123");
    });

    it("should use the string as subject (full url)", () => {
      cy.wrap(url).param("q").should("eq", "test search");

      cy.wrap(url).param("item").should("eql", ["abc", "def"]);

      cy.wrap(url).param("count").should("eq", "123");
    });

    it("should return the default for an unknown parameter", () => {
      cy.wrap(query).param("wrong", "abc123").should("eq", "abc123");

      cy.wrap(query).param("wrong").should("be.null");
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

      cy.wrap(123).param("name");
    });

    it("should throw an error if subject is a boolean", (done) => {
      assertFailure(done, true);

      cy.wrap(true).param("name");
    });

    it("should throw an error if subject is an object without toString method and url property", (done) => {
      assertFailure(done, "[object Object]");

      cy.wrap({ propA: 123, propB: false }).param("name");
    });
  });
});

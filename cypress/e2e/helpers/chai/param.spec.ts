import { expectAssertionErrorOnFail } from "cypress/support/e2e";

describe("The param method", () => {
  describe("In regular mode", () => {
    it("should not throw when the param exists", () => {
      expect("https://lib.ugent.be/?test=abc123").to.have.param("test");
      expect(
        "https://lib.ugent.be/?test=abc123&ignore=true&test=def456",
      ).to.have.param("test");
    });

    it("should not throw when the param exists and equals the value", () => {
      expect("https://lib.ugent.be/?test=abc123").to.have.param(
        "test",
        "abc123",
      );
      expect(
        "https://lib.ugent.be/?test=abc123&ignore=true&test=def456",
      ).to.have.param("test", ["abc123", "def456"]);
    });

    it("should throw when the param does not exist", (done) => {
      expectAssertionErrorOnFail(done, "expected param 'other' to exist");

      expect("https://lib.ugent.be/?test=abc123").to.have.param(
        "other",
        "abc123",
      );
    });

    it("should throw when the param does not equal the argument", (done) => {
      expectAssertionErrorOnFail(
        done,
        "expected param 'test' to equal 'abc124' but got 'abc123'",
      );

      expect("https://lib.ugent.be/?test=abc123").to.have.param(
        "test",
        "abc124",
      );
    });
  });

  describe("In negative  mode", () => {
    it("should not throw when the param does not exist", () => {
      expect("https://lib.ugent.be/?test=abc123").to.not.have.param("other");
    });

    it("should throw when the param does exist", (done) => {
      expectAssertionErrorOnFail(done, "expected param 'test' to not exist");

      expect("https://lib.ugent.be/?test=abc123").to.not.have.param("test");
    });

    it("should throw when negating the chain with a value", (done) => {
      expectAssertionErrorOnFail(
        done,
        "chai method param does not support negation",
      );

      expect("https://lib.ugent.be/?test=abc123").to.not.have.param(
        "other",
        "abc123",
      );
    });
  });
});

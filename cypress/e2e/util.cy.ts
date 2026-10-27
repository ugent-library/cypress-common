import {
  addToConsoleProps,
  addToLog,
  logCommand,
  NO_LOG,
  updateConsoleProps,
  updateLogMessage,
} from "cypress-common/util";

function getConsoleProps(log: Cypress.Log) {
  return log.get("consoleProps")().props;
}

describe("The util functions", () => {
  describe("NO_LOG", () => {
    it("should be a frozen options object that disables logging", () => {
      expect(NO_LOG).to.eql({ log: false });
      expect(NO_LOG).to.be.frozen;
    });
  });

  describe("logCommand", () => {
    it("should create a log entry with the command name", () => {
      const log = logCommand("some-command");

      expect(log.get("name")).to.eq("some-command");
      expect(log.get("message")).to.eq("");
      expect(getConsoleProps(log)).to.eql({});
    });

    it("should set the message and console props", () => {
      const log = logCommand("some-command", {
        message: "some message",
        consoleProps: { a: 1, b: "two" },
      });

      expect(log.get("message")).to.eq("some message");
      expect(log.get("consoleProps")()).to.have.property("props");
      expect(getConsoleProps(log)).to.eql({ a: 1, b: "two" });
    });

    it("should not mutate the passed console props", () => {
      const consoleProps = { a: 1 };
      const log = logCommand("some-command", { consoleProps });

      updateConsoleProps(log, { b: 2 });

      expect(consoleProps).to.eql({ a: 1 });
      expect(getConsoleProps(log)).to.eql({ a: 1, b: 2 });
    });

    it("should set the element to highlight", () => {
      const $el = Cypress.$("<div>test</div>");
      const log = logCommand("some-command", { $el });

      expect(log.get("$el")).to.eq($el);
    });
  });

  describe("updateLogMessage", () => {
    it("should do nothing if no log is passed", () => {
      expect(() => updateLogMessage(undefined, "test")).not.to.throw();
    });

    it("should set the value as message if the message is empty", () => {
      const log = logCommand("some-command");

      updateLogMessage(log, "test");

      expect(log.get("message")).to.eq("test");
    });

    it("should append values with the default separator", () => {
      const log = logCommand("some-command", { message: "page" });

      updateLogMessage(log, 2);
      updateLogMessage(log, "test");

      expect(log.get("message")).to.eq("page, 2, test");
    });

    it("should append values with a custom separator", () => {
      const log = logCommand("some-command", { message: "page" });

      updateLogMessage(log, 2, "=");
      updateLogMessage(log, "test", " | ");

      expect(log.get("message")).to.eq("page=2 | test");
    });

    it("should append strings as-is", () => {
      const log = logCommand("some-command");

      updateLogMessage(log, `[0] => it's "quoted"`);

      expect(log.get("message")).to.eq(`[0] => it's "quoted"`);
    });

    it("should format other primitives", () => {
      const log = logCommand("some-command");

      updateLogMessage(log, 1.5);
      updateLogMessage(log, true);
      updateLogMessage(log, null);
      updateLogMessage(log, undefined);

      expect(log.get("message")).to.eq("1.5, true, null, undefined");
    });

    it("should format arrays with double quoted strings", () => {
      const log = logCommand("some-command");

      updateLogMessage(log, ["a", "b", 1, true], " | ");
      updateLogMessage(log, [], " | ");
      updateLogMessage(log, [[1], 2], " | ");

      expect(log.get("message")).to.eq(`["a", "b", 1, true] | [] | [[ 1 ], 2]`);
    });

    it("should format objects with double quoted strings", () => {
      const log = logCommand("some-command");

      updateLogMessage(log, { a: 1, b: "two", c: [1, 2] }, " | ");
      updateLogMessage(log, {}, " | ");

      expect(log.get("message")).to.eq(`{a: 1, b: "two", c: [ 1, 2 ]} | {}`);
    });

    it("should format maps, sets and class instances", () => {
      class Foo {
        a = 1;
      }

      const log = logCommand("some-command");

      updateLogMessage(log, new Map([["a", 1]]), " | ");
      updateLogMessage(log, new Set([1, 2]), " | ");
      updateLogMessage(log, new Foo(), " | ");

      expect(log.get("message")).to.eq(`Map{"a" => 1} | Set{1, 2} | Foo{a: 1}`);
    });

    it("should escape quotes in formatted strings", () => {
      const log = logCommand("some-command");

      updateLogMessage(log, ['say "hi"', "it's"]);

      expect(log.get("message")).to.eq(`["say \\"hi\\"", "it's"]`);
    });

    it("should truncate long formatted values", () => {
      const log = logCommand("some-command");

      updateLogMessage(
        log,
        Array.from({ length: 30 }, (_, i) => `item${i}`),
        " | ",
      );
      updateLogMessage(log, { text: "x".repeat(100) }, " | ");

      expect(log.get("message")).to.eq(
        `["item0", "item1", "item2", "item3", …(26)] | {text: "${"x".repeat(37)}…"}`,
      );
    });

    it("should not truncate long strings", () => {
      const log = logCommand("some-command");

      updateLogMessage(log, "x".repeat(100));

      expect(log.get("message")).to.eq("x".repeat(100));
    });
  });

  describe("updateConsoleProps", () => {
    it("should do nothing if no log is passed", () => {
      expect(() => updateConsoleProps(undefined, { a: 1 })).not.to.throw();
    });

    it("should do nothing if the log was not created with logCommand", () => {
      const log = Cypress.log({ name: "some-command" });

      expect(() => updateConsoleProps(log, { a: 1 })).not.to.throw();
    });

    it("should add and overwrite console props with an object", () => {
      const log = logCommand("some-command", { consoleProps: { a: 1, b: 2 } });

      updateConsoleProps(log, { b: 3, c: 4 });

      expect(getConsoleProps(log)).to.eql({ a: 1, b: 3, c: 4 });
    });

    it("should update console props with a callback", () => {
      const log = logCommand("some-command", {
        consoleProps: { attempts: [1] },
      });

      updateConsoleProps(log, (consoleProps) => {
        consoleProps.attempts.push(2);
        consoleProps.done = true;
      });

      expect(getConsoleProps(log)).to.eql({ attempts: [1, 2], done: true });
    });
  });

  describe("addToConsoleProps", () => {
    it("should add the yielded value to the console props and yield it unchanged", () => {
      const log = logCommand("some-command", { message: "test" });
      const subject = { a: 1 };

      cy.wrap(subject, NO_LOG)
        .then(addToConsoleProps(log, "yielded"))
        .should("eq", subject)
        .then(() => {
          expect(getConsoleProps(log)).to.eql({ yielded: subject });
          expect(log.get("message")).to.eq("test");
        });
    });

    it("should yield the value unchanged if no log is passed", () => {
      cy.wrap(123, NO_LOG)
        .then(addToConsoleProps(undefined, "yielded"))
        .should("eq", 123);
    });
  });

  describe("addToLog", () => {
    it("should add primitives to the console props and the message", () => {
      const log = logCommand("some-command", { message: "test" });

      cy.wrap("abc", NO_LOG)
        .then(addToLog(log, "string"))
        .should("eq", "abc")
        .wrap(123, NO_LOG)
        .then(addToLog(log, "number"))
        .wrap(false, NO_LOG)
        .then(addToLog(log, "boolean"))
        .then(() => {
          expect(getConsoleProps(log)).to.eql({
            string: "abc",
            number: 123,
            boolean: false,
          });
          expect(log.get("message")).to.eq("test, abc, 123, false");
        });
    });

    it("should add arrays of primitives to the message", () => {
      const log = logCommand("some-command", { message: "test" });

      cy.wrap(["a", 1, true], NO_LOG)
        .then(addToLog(log, "yielded"))
        .then(() => {
          expect(getConsoleProps(log)).to.eql({ yielded: ["a", 1, true] });
          expect(log.get("message")).to.eq(`test, ["a", 1, true]`);
        });
    });

    it("should use the custom separator", () => {
      const log = logCommand("some-command", { message: "page" });

      cy.wrap("2", NO_LOG)
        .then(addToLog(log, "yielded", "="))
        .then(() => {
          expect(log.get("message")).to.eq("page=2");
        });
    });

    it("should only add empty strings, objects and non-primitive arrays to the console props", () => {
      const log = logCommand("some-command", { message: "test" });

      cy.wrap("", NO_LOG)
        .then(addToLog(log, "empty"))
        .wrap({ a: 1 }, NO_LOG)
        .then(addToLog(log, "object"))
        .wrap([1, { a: 1 }], NO_LOG)
        .then(addToLog(log, "array"))
        .then(() => {
          expect(getConsoleProps(log)).to.eql({
            empty: "",
            object: { a: 1 },
            array: [1, { a: 1 }],
          });
          expect(log.get("message")).to.eq("test");
        });
    });

    it("should yield the value unchanged if no log is passed", () => {
      cy.wrap("abc", NO_LOG)
        .then(addToLog(undefined, "yielded"))
        .should("eq", "abc");
    });
  });
});

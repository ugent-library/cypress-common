describe("The attr command", () => {
  const someInput =
    '<input id="someInput" type="text" value="some value" formaction="test" maxlength="123" readonly data-id="987" data-type="input">';

  beforeEach(() => {
    cy.visit("/");

    cy.document().then((doc) => {
      Cypress.$(someInput).appendTo(doc.body);
    });
  });

  it("should be possible to get an attribute from an object", () => {
    cy.get("#someInput").as("some-input");

    // String
    cy.get("@some-input")
      .attr("value")
      .should("be.a", "string")
      .and("eq", "some value");

    // String (URL)
    cy.get("@some-input")
      .attr("formaction")
      .should("be.a", "string")
      .and("eq", "test");

    // Number
    cy.get("@some-input")
      .attr("maxlength")
      .should("be.a", "string")
      .and("eq", "123");

    // Boolean
    cy.get("@some-input")
      .attr("readonly")
      .should("be.a", "string")
      .and("eq", "readonly");

    // Object
    cy.get("@some-input").attr("data-id").should("eq", "987");
    cy.get("@some-input").attr("data-type").should("eq", "input");

    // Undefined
    cy.get("@some-input").attr("disabled").should("be.undefined");
    cy.get("@some-input").attr("nonExistingAttribute").should("be.undefined");
  });

  it("should be possible to set an attribute on an object", () => {
    cy.get("#someInput").as("some-input");

    // String
    cy.get("@some-input")
      .attr("value", "some other value")
      .should("have.id", "someInput");
    cy.get("@some-input").should("have.attr", "value", "some other value");

    // Number
    cy.get("@some-input").attr("maxlength", 456).should("have.id", "someInput");
    cy.get("@some-input").should("have.attr", "maxlength", "456");
    cy.get("@some-input").should("have.prop", "maxLength", 456);

    // Boolean
    cy.get("@some-input").should("not.have.attr", "required");
    cy.get("@some-input").should("have.prop", "required").and("be.false");
    cy.get("@some-input")
      .attr("required", "required")
      .should("have.id", "someInput");
    cy.get("@some-input").should("have.attr", "required").and("eq", "required");
    cy.get("@some-input").should("have.prop", "required").and("be.true");

    // Object
    cy.get("@some-input").attr("type", "date");
    cy.get("@some-input").should("have.prop", "valueAsDate").should("be.null");
    cy.get("@some-input")
      .attr("value", "2026-10-19")
      .should("have.id", "someInput");
    cy.get("@some-input")
      .should("have.prop", "valueAsDate")
      .should("be.a", "Date")
      .invoke("toISOString")
      .should("eq", "2026-10-19T00:00:00.000Z");

    // Function
    cy.get("@some-input").attr("type", "text");
    cy.get("@some-input")
      .attr("value", () => "yet some other value")
      .should("have.id", "someInput");
    cy.get("@some-input").should("have.attr", "value", "yet some other value");

    // Null (removes the attribute)
    cy.get("@some-input").should("have.attr", "value");
    cy.get("@some-input").attr("value", null).should("have.id", "someInput");
    cy.get("@some-input").should("not.have.attr", "value");
  });

  it("should be possible to set multiple attributes on an object at once", () => {
    cy.get("#someInput").as("some-input");

    cy.get("@some-input")
      .attr({
        value: "some other value",
        maxlength: 456,
        required: "required",
      })
      .should("have.id", "someInput");
    cy.get("@some-input").should("have.attr", "value", "some other value");
    cy.get("@some-input").should("have.attr", "maxlength", "456");
    cy.get("@some-input").should("have.prop", "maxLength", 456);
    cy.get("@some-input").should("have.attr", "required", "required");
    cy.get("@some-input").should("have.prop", "required", true);

    cy.get("@some-input")
      .attr({
        value: () => "yet another value",
        maxlength: () => 789,
        disabled: ()=> "disabled",
      })
      .should("have.id", "someInput");
    cy.get("@some-input").should("have.attr", "value", "yet another value");
    cy.get("@some-input").should("have.attr", "maxlength", "789");
    cy.get("@some-input").should("have.prop", "maxLength", 789);
    cy.get("@some-input").should("have.attr", "disabled", "disabled");
    cy.get("@some-input").should("have.prop", "disabled", true);
  });

  it("should be possible to set one or more attributes on multiple objects at once", () => {
    cy.document().then((doc) => {
      Cypress.$(someInput).attr("id", "someOtherInput").appendTo(doc.body);
      Cypress.$(someInput).attr("id", "yetAnotherInput").appendTo(doc.body);
    });

    cy.get("#someInput").as("input1");
    cy.get("#someOtherInput").as("input2");
    cy.get("#yetAnotherInput").as("input3");

    cy.get("#someInput, #someOtherInput, #yetAnotherInput")
      .attr("name", "anInputName")
      .should("have.id", "someInput");

    cy.get("@input1").should("have.attr", "name", "anInputName");
    cy.get("@input2").should("have.attr", "name", "anInputName");
    cy.get("@input3").should("have.attr", "name", "anInputName");

    cy.get("#someInput, #someOtherInput, #yetAnotherInput")
      .attr({
        value: "some other value",
        maxlength: 456,
        required: "required",
      })
      .should("have.id", "someInput");

    cy.get("@input1").should("have.attr", "value", "some other value");
    cy.get("@input1").should("have.attr", "maxlength", "456");
    cy.get("@input1").should("have.attr", "required", "required");

    cy.get("@input2").should("have.attr", "value", "some other value");
    cy.get("@input2").should("have.attr", "maxlength", "456");
    cy.get("@input2").should("have.attr", "required", "required");

    cy.get("@input3").should("have.attr", "value", "some other value");
    cy.get("@input3").should("have.attr", "maxlength", "456");
    cy.get("@input3").should("have.attr", "required", "required");
  });

  it("should be possible to set a falsy attribute value", () => {
    cy.get("#someInput").as("some-input");

    const attributes = [
      { name: "value", reset: "test" },
      { name: "maxlength", reset: 123 },
    ];

    const falsyValues = [
      { value: "", exp: "" },
      { value: 0, exp: "0" },
    ];

    for (const { name, reset } of attributes) {
      for (const falsyValue of falsyValues) {
        cy.log(
          `Setting ${name} to ${falsyValue.value === "" ? '""' : falsyValue.value}`,
        );
        cy.get("@some-input").attr(name, reset).should("have.id", "someInput");
        cy.get("@some-input").should("have.attr", name, String(reset));

        cy.get("@some-input")
          .attr(name, falsyValue.value)
          .should("have.id", "someInput");
        cy.get("@some-input").should("have.attr", name, falsyValue.exp);
      }
    }
  });
});

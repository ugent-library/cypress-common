describe("The prop command", () => {
  const someInput =
    '<input id="someInput" type="text" value="some value" formaction="test" maxLength="123" readonly data-id="987" data-type="input">';

  beforeEach(() => {
    cy.visit("/");

    cy.document().then((doc) => {
      Cypress.$(someInput).appendTo(doc.body);
    });
  });

  it("should be possible to get a property from an object", () => {
    cy.get("#someInput").as("some-input");

    // String
    cy.get("@some-input")
      .prop("value")
      .should("be.a", "string")
      .and("eq", "some value");

    // String (URL)
    cy.get("@some-input")
      .prop("formAction")
      .should("be.a", "string")
      .and("eq", `${Cypress.config("baseUrl")}/test`);

    // Number
    cy.get("@some-input")
      .prop("maxLength")
      .should("be.a", "number")
      .and("eq", 123);

    // Boolean
    cy.get("@some-input")
      .prop("readOnly")
      .should("be.a", "boolean")
      .and("be.true");

    // Object
    cy.get("@some-input")
      .prop<object>("dataset")
      .should("be.a", "DOMStringMap")
      .then((d) => ({ ...d }))
      .should("eql", { type: "input", id: "987" });

    // Null
    cy.get("@some-input").prop("valueAsDate").should("be.null");

    // Undefined
    cy.get("@some-input").prop("nonExistingProperty").should("be.undefined");
  });

  it("should be possible to set a property on an object", () => {
    cy.get("#someInput").as("some-input");

    // String
    cy.get("@some-input")
      .prop("value", "some other value")
      .should("have.id", "someInput");
    cy.get("@some-input").should("have.prop", "value", "some other value");

    // Number
    cy.get("@some-input").prop("maxLength", 456).should("have.id", "someInput");
    cy.get("@some-input").should("have.prop", "maxLength", 456);

    // Boolean
    cy.get("@some-input").should("have.prop", "required", false);
    cy.get("@some-input").prop("required", true).should("have.id", "someInput");
    cy.get("@some-input").should("have.prop", "required").and("be.true");

    // Object
    cy.get("@some-input").prop("type", "date");
    cy.get("@some-input").should("have.prop", "valueAsDate").should("be.null");
    const dateISOString = "2026-10-19T00:00:00.000Z";
    cy.get("@some-input")
      .prop("valueAsDate", new Date(dateISOString))
      .should("have.id", "someInput");
    cy.get("@some-input")
      .should("have.prop", "valueAsDate")
      .should("be.a", "Date")
      .invoke("toISOString")
      .should("eq", dateISOString);

    // Function
    cy.get("@some-input").prop("type", "text");
    cy.get("@some-input")
      .prop("value", () => "yet some other value")
      .should("have.id", "someInput");
    cy.get("@some-input").should("have.prop", "value", "yet some other value");

    // Event function
    const fn = cy.spy().as("clickSpy");
    cy.get("@some-input")
      .prop("onclick", () => fn)
      .should("have.id", "someInput");
    cy.get("@some-input").click();
    cy.get("@clickSpy").should("have.been.calledOnce");
  });

  it("should be possible to set multiple properties on an object at once", () => {
    cy.get("#someInput").as("some-input");

    cy.get("@some-input")
      .prop({
        value: "some other value",
        maxLength: 456,
        required: true,
      })
      .should("have.id", "someInput");
    cy.get("@some-input").should("have.prop", "value", "some other value");
    cy.get("@some-input").should("have.prop", "maxLength", 456);
    cy.get("@some-input").should("have.prop", "required").and("be.true");
  });

  it("should be possible to set one or more properties on multiple objects at once", () => {
    cy.document().then((doc) => {
      Cypress.$(someInput).attr("id", "someOtherInput").appendTo(doc.body);
      Cypress.$(someInput).attr("id", "yetAnotherInput").appendTo(doc.body);
    });

    cy.get("#someInput").as("input1");
    cy.get("#someOtherInput").as("input2");
    cy.get("#yetAnotherInput").as("input3");

    cy.get("#someInput, #someOtherInput, #yetAnotherInput")
      .prop("name", "anInputName")
      .should("have.id", "someInput");

    cy.get("@input1").should("have.prop", "name", "anInputName");
    cy.get("@input2").should("have.prop", "name", "anInputName");
    cy.get("@input3").should("have.prop", "name", "anInputName");

    cy.get("#someInput, #someOtherInput, #yetAnotherInput")
      .prop({
        value: "some other value",
        maxLength: 456,
        required: true,
      })
      .should("have.id", "someInput");

    cy.get("@input1").should("have.prop", "value", "some other value");
    cy.get("@input1").should("have.prop", "maxLength", 456);
    cy.get("@input1").should("have.prop", "required").and("be.true");

    cy.get("@input2").should("have.prop", "value", "some other value");
    cy.get("@input2").should("have.prop", "maxLength", 456);
    cy.get("@input2").should("have.prop", "required").and("be.true");

    cy.get("@input3").should("have.prop", "value", "some other value");
    cy.get("@input3").should("have.prop", "maxLength", 456);
    cy.get("@input3").should("have.prop", "required").and("be.true");
  });

  it("should be possible to set a falsy property value", () => {
    cy.get("#someInput").as("some-input");

    const props = [
      { name: "value", type: "string", reset: "test" },
      { name: "maxLength", type: "number", reset: 123 },
      { name: "readOnly", type: "boolean", reset: true },
    ] as const;

    const falsyValues: {
      value: string | number | boolean | null;
      exp: Record<"string" | "number" | "boolean", string | number | boolean>;
    }[] = [
      { value: "", exp: { string: "", number: 0, boolean: false } },
      { value: 0, exp: { string: "0", number: 0, boolean: false } },
      { value: false, exp: { string: "false", number: 0, boolean: false } },
      { value: null, exp: { string: "", number: 0, boolean: false } },
    ];

    for (const { name, type, reset } of props) {
      for (const falsyValue of falsyValues) {
        cy.log(
          `Setting ${name} to ${falsyValue.value === "" ? '""' : falsyValue.value}`,
        );
        cy.get("@some-input").prop(name, reset).should("have.id", "someInput");
        cy.get("@some-input").should("have.prop", name, reset);

        cy.get("@some-input")
          .prop(name, falsyValue.value)
          .should("have.id", "someInput");
        cy.get("@some-input").should("have.prop", name, falsyValue.exp[type]);
      }
    }

    // Extra test for objects
    const date = new Date("2026-10-19T00:00:00.000Z");
    cy.get("@some-input").prop("type", "date").should("have.id", "someInput");
    cy.get("@some-input")
      .prop("valueAsDate", date)
      .should("have.id", "someInput");
    cy.get("@some-input").should("have.prop", "valueAsDate").and("not.be.null");

    cy.get("@some-input")
      .prop("valueAsDate", null)
      .should("have.id", "someInput");
    cy.get("@some-input").should("have.prop", "valueAsDate").and("be.null");
  });
});

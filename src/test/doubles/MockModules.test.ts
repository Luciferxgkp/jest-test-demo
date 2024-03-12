import * as OtherUtils from "../../app/doubles/Utils";
jest.mock("../../app/doubles/Utils", () => ({
  ...jest.requireActual("../../app/doubles/Utils"),
  calculateComplexity: () => 10,
}));

jest.mock("uuid", () => ({
  v4: () => 123,
}));

describe.only("Mock Modules suite", () => {
  it("calculate complexity", () => {
    const actual = OtherUtils.calculateComplexity({} as any);

    expect(actual).toBe(10);
  });

  it("keep other functions", () => {
    const actual = OtherUtils.toUpperCase("abc");

    expect(actual).toBe("ABC");
  });

  it("string with id", () => {
    const actual = OtherUtils.toLowerCase("ABC");
    
    expect(actual).toBe("abc123");
  });
});

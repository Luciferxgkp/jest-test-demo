import { getStringInfo, toUpperCase } from "../app/Utils";

describe("Utils test suite", () => {
  it("should return uppercase", () => {
    const expected = "ABC";

    const actual = toUpperCase("abc");

    expect(actual).toBe(expected);
  });

  describe("getStringInfo for args should", () => {
    it("return right length", () => {
      const actual = getStringInfo("My-string");

      expect(actual.characters).toHaveLength(9);
    });

    it("return right lowercase", () => {
      const actual = getStringInfo("My-string");

      expect(actual.lowercase).toBe("my-string");
    });

    it("return right uppercase", () => {
      const actual = getStringInfo("My-string");

      expect(actual.uppercase).toBe("MY-STRING");
    });

    it("return defined extra info", () => {
      const actual = getStringInfo("My-string");

      expect(actual.extraInfo).toBeDefined();
    });
  });

  describe("ToUppercase examples", () => {
    it.each([
      {
        input: "abc",
        expected: "ABC",
      },
      {
        input: "My-string",
        expected: "MY-STRING",
      },
      {
        input: "def",
        expected: "DEF",
      },
    ])("$input toUpperCase should be $expected", ({ input, expected }) => {
      const actual = getStringInfo(input);

      expect(actual.uppercase).toBe(expected);
    });
  });
});

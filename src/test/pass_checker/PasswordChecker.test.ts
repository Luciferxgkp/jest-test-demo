import {
  PasswordChecker,
  PasswordErrors,
} from "../../app/pass_checker/PasswordChecker";

describe("Password Checker test suits", () => {
  let sut: PasswordChecker;

  beforeEach(() => {
    sut = new PasswordChecker();
  });

  it("Password with less than 8 characters is invalid", () => {
    const actual = sut.checkPassword("1234567");

    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.SHORT);
  });

  it("Password must than 8 character is ok", () => {
    const actual = sut.checkPassword("12345678Aa");

    expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.SHORT);
  });

  it("Password with no uppercase is invalid", () => {
    const actual = sut.checkPassword("12345678abc");

    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.NO_UPPER_CASE);
  });

  it("Password with an uppercase is ok", () => {
    const actual = sut.checkPassword("12345678Abc");

    expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPER_CASE);
  });

  it("Password with no lowercase is invalid", () => {
    const actual = sut.checkPassword("12345678ABC");

    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.NO_LOWER_CASE);
  });

  it("Password with an lowercase is ok", () => {
    const actual = sut.checkPassword("12345678Abc");

    expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.NO_LOWER_CASE);
  });

  it("Admin password with no number is invalid", () => {
    const actual = sut.checkAdminPassword("abcdABCD");

    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.NO_NUMBER);
  });

  it("Admin passord with number is valid", () => {
    const actual = sut.checkAdminPassword("abcdABC12");

    expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.NO_NUMBER);
  });
});

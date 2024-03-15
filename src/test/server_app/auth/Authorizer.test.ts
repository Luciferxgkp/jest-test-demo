import { Authorizer } from "../../../server_app/auth/Authorizer";
import { SessionTokenDataAccess } from "../../../server_app/data/SessionTokenDataAccess";
import { UserCredentialsDataAccess } from "../../../server_app/data/UserCredentialsDataAccess";

const isValidTokenMock = jest.fn();
const generateTokenMock = jest.fn();
const invalidateTokenMock = jest.fn();

jest.mock("../../../server_app/data/SessionTokenDataAccess", () => {
  return {
    SessionTokenDataAccess: jest.fn().mockImplementation(() => {
      return {
        isValidToken: isValidTokenMock,
        generateToken: generateTokenMock,
        invalidateToken: invalidateTokenMock,
      };
    }),
  };
});

const addUserMock = jest.fn();
const getUserByUserNameMock = jest.fn();
jest.mock("../../../server_app/data/UserCredentialsDataAccess", () => {
  return {
    UserCredentialsDataAccess: jest.fn().mockImplementation(() => {
      return {
        addUser: addUserMock,
        getUserByUserName: getUserByUserNameMock,
      };
    }),
  };
});

describe("Authorizer test suite", () => {
  let sut: Authorizer;

  const someId = "1234";
  const someUserName = "someUserName";
  const somePassword = "somePassword";

  beforeEach(() => {
    sut = new Authorizer();
    expect(SessionTokenDataAccess).toHaveBeenCalledTimes(1);
    expect(UserCredentialsDataAccess).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return id for new registered user", async () => {
    isValidTokenMock.mockResolvedValueOnce(false);

    const actual = await sut.validateToken(someId);

    expect(actual).toBe(false);
  });

  it("should return id for new registered user", async () => {
    addUserMock.mockResolvedValueOnce(someId);

    const actual = await sut.registerUser(someUserName, somePassword);

    expect(actual).toBe(someId);
    expect(addUserMock).toBeCalledWith({
      id: "",
      password: somePassword,
      userName: someUserName,
    });
  });
  it("SHould return token id for valid credentials", async () => {
    getUserByUserNameMock.mockResolvedValueOnce({
      password: somePassword,
    });

    generateTokenMock.mockResolvedValueOnce(someId);

    const actual = await sut.login(someUserName, somePassword);

    expect(actual).toBe(someId);
  });

  it("should return undefined for invalid credentails", async () => {
    getUserByUserNameMock.mockResolvedValueOnce({
      password: somePassword,
    });

    generateTokenMock.mockResolvedValueOnce(someId);

    const actual = await sut.login(someUserName, "someOtherPassowrd");

    expect(actual).toBeUndefined();
  });

  it("should invalidate token on logout call", async () => {
    await sut.logout(someId);

    expect(invalidateTokenMock).toBeCalledWith(someId);
  });
});

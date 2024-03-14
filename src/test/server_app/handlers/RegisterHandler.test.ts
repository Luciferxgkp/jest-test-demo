import { RegisterHandler } from "../../../server_app/handlers/RegisterHandler";
import { Account } from "../../../server_app/model/AuthModel";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../../server_app/model/ServerModel";

const getRequestBodyMock = jest.fn();
jest.mock("../../../server_app/utils/Utils", () => ({
  getRequestBody: () => getRequestBodyMock(),
}));

describe("Registration test suite", () => {
  let sut: RegisterHandler;

  const request = {
    method: undefined,
  };

  const responseMock = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn(),
  };

  const authorizerMock = {
    registerUser: jest.fn(),
  };

  const someAccount: Account = {
    id: "",
    password: "password",
    userName: "userName",
  };

  const someId = "1234";

  beforeEach(() => {
    sut = new RegisterHandler(
      request as any,
      responseMock as any,
      authorizerMock as any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should register valid accounts in register", async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(someAccount);
    authorizerMock.registerUser.mockResolvedValueOnce(someId);

    await sut.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify({
        userId: someId,
      })
    );
  });

  it("Should not register invalid account in requests", async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce({});

    await sut.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify("userName and password required")
    );
  });

  it("Should do nothing for not supported http method", async () => {
    request.method = HTTP_METHODS.GET;
    await sut.handleRequest();

    expect(responseMock.writeHead).not.toBeCalled();
    expect(responseMock.write).not.toBeCalled();
    expect(getRequestBodyMock).not.toBeCalled();
  });
});

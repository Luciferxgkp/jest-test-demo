import { getRequestBody } from "../../../server_app/utils/Utils";

const requestMock = {
  on: jest.fn(),
};

const someObject = {
  name: "john",
  age: 30,
  city: "Paris",
};

const someObjectAsString = JSON.stringify(someObject);

describe("get request body suite", () => {
  it("should return object for valid JSON", async () => {
    requestMock.on.mockImplementation((event, cb) => {
      if (event === "data") {
        cb(someObjectAsString);
      } else cb();
    });

    const actual = await getRequestBody(requestMock as any);

    expect(actual).toEqual(someObject);
  });
  it("should throw error for invalid JSON", async () => {
    requestMock.on.mockImplementation((event, cb) => {
      if (event == "data") {
        cb("a");
      } else {
        cb();
      }
    });

    await expect(getRequestBody(requestMock as any)).rejects.toThrow("");
  });

  it("Should throw error for unexpected error", async () => {
    const someError = new Error("Something went wrong");
    requestMock.on.mockImplementation((event, cb) => {
      if (event === "error") {
        cb(someError);
      }
    });

    await expect(getRequestBody(requestMock as any)).rejects.toThrow(
      someError.message
    );
  });
});

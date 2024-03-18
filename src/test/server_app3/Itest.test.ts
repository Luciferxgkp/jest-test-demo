import { Account } from "../../server_app/model/AuthModel";
import { Reservation } from "../../server_app/model/ReservationModel";
import { HTTP_CODES, HTTP_METHODS } from "../../server_app/model/ServerModel";
import { Server } from "../../server_app/server/Server";
import { makeAwesomeRequest } from "./utils/http-client";
describe("Server app integration test", () => {
  let server: Server;
  beforeAll(() => {
    server = new Server();
    server.startServer();
  });

  afterAll(() => {
    server.stopServer();
  });

  const someUser: Account = {
    id: "",
    userName: "userName",
    password: "password",
  };

  const someReservation: Reservation = {
    id: "",
    endDate: "someEndDate",
    startDate: "someStartDate",
    room: "someRoom",
    user: "someUser",
  };

  it("Should register new user", async () => {
    const result = await fetch("http://localhost:8080/register", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someUser),
    });

    const resultBody = await result.json();

    expect(result.status).toBe(HTTP_CODES.CREATED);
    expect(resultBody.userId).toBeDefined();
  });

  it("Should register new user with awesome request", async () => {
    const result = await makeAwesomeRequest(
      {
        host: "localhost",
        port: 8080,
        method: HTTP_METHODS.POST,
        path: "/register",
      },
      someUser
    );

    expect(result.statusCode).toBe(HTTP_CODES.CREATED);
    expect(result.body.userId).toBeDefined();
  });

  let token: string;
  it("Should login a register user", async () => {
    const result = await fetch("http://localhost:8080/login", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someUser),
    });

    const resultBody = await result.json();

    expect(result.status).toBe(HTTP_CODES.CREATED);
    expect(resultBody.token).toBeDefined();
    token = resultBody.token;
  });

  let createdReservationId: string;
  it("should create reservation id if authorized", async () => {
    const result = await fetch("http://localhost:8080/reservation", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        authorization: token,
      },
    });
    const resultBody = await result.json();

    expect(result.status).toBe(HTTP_CODES.CREATED);
    expect(resultBody.reservationId).toBeDefined();
    createdReservationId = resultBody.reservationId;
  });

  it("Should get reservation if authorized", async () => {
    const result = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.GET,
        headers: {
          authorization: token,
        },
      }
    );
    const resultBody = await result.json();

    const expectedReservation = structuredClone(someReservation);
    expectedReservation.id = createdReservationId;

    expect(result.status).toBe(HTTP_CODES.OK);
    expect(resultBody).toEqual(expectedReservation);
  });

  it("Should create and retrieve multiple reservations if authorized", async () => {
    await fetch("http://localhost:8080/reservation", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        authorization: token,
      },
    });
    await fetch("http://localhost:8080/reservation", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        authorization: token,
      },
    });
    await fetch("http://localhost:8080/reservation", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        authorization: token,
      },
    });

    const getAllResults = await fetch(`http://localhost:8080/reservation/all`, {
      method: HTTP_METHODS.GET,
      headers: {
        authorization: token,
      },
    });
    const resultBody = await getAllResults.json();

    expect(getAllResults.status).toBe(HTTP_CODES.OK);
    expect(resultBody).toHaveLength(4);
  });

  it("Should update reservation if authorized", async () => {
    const updateResult = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify({
          startDate: "otherStartDate",
        }),
        headers: {
          authorization: token,
        },
      }
    );

    expect(updateResult.status).toBe(HTTP_CODES.OK);

    const getResult = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.GET,
        headers: {
          authorization: token,
        },
      }
    );

    const resultBody = await getResult.json();
    expect(getResult.status).toBe(HTTP_CODES.OK);
    expect(resultBody.startDate).toBe("otherStartDate");
  });

  it("Should delete reservation if authourized", async () => {
    const deleteResult = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.DELETE,
        headers: {
          authorization: token,
        },
      }
    );

    expect(deleteResult.status).toBe(HTTP_CODES.OK);

    const getResult = await fetch(
      `http://localhost:8080/reservation/${createdReservationId}`,
      {
        method: HTTP_METHODS.GET,
        headers: {
          authorization: token,
        },
      }
    );

    expect(getResult.status).toBe(HTTP_CODES.NOT_fOUND);
  });
});

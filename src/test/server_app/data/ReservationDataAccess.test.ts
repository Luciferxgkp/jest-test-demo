import { ReservationsDataAccess } from "../../../server_app/data/ReservationsDataAccess";
import { Reservation } from "../../../server_app/model/ReservationModel";

const insertMock = jest.fn();
const getByMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();
const getAllElementsMock = jest.fn();
jest.mock("../../../server_app/data/DataBase", () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        getBy: getByMock,
        update: updateMock,
        delete: deleteMock,
        getAllElements: getAllElementsMock,
      };
    }),
  };
});

describe("Reservation Data Access Suite", () => {
  let sut: ReservationsDataAccess;

  const someReservation: Reservation = {
    id: "",
    user: "user1",
    startDate: "startDate",
    endDate: "endDate",
    room: "someRoom",
  };
  const someOtherReservation: Reservation = {
    id: "",
    user: "user2",
    startDate: "startDate",
    endDate: "endDate",
    room: "someOtherRoom",
  };

  const reservationId = "1234";

  beforeEach(() => {
    sut = new ReservationsDataAccess();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should create a reservation and return an id", async () => {
    insertMock.mockResolvedValueOnce(reservationId);

    const actualId = await sut.createReservation(someReservation);

    expect(actualId).toBe(reservationId);
    expect(insertMock).toHaveBeenCalledWith(someReservation);
  });

  it("Should update the reservation", async () => {
    await sut.updateReservation(reservationId, "room", "someOtherRoom");

    expect(updateMock).toHaveBeenCalledWith(
      reservationId,
      "room",
      "someOtherRoom"
    );
  });

  it("Should delete a reservation", async () => {
    await sut.deleteReservation(reservationId);

    expect(deleteMock).toHaveBeenCalledWith(reservationId);
  });

  it("Should return a reservation by id", async () => {
    getByMock.mockResolvedValueOnce(someReservation);

    const actual = await sut.getReservation(reservationId);

    expect(actual).toEqual(someReservation);
    expect(getByMock).toBeCalledWith("id", reservationId);
  });

  it("SHould return all the reservations", async () => {
    getAllElementsMock.mockResolvedValueOnce([
      someReservation,
      someOtherReservation,
    ]);

    const actual = await sut.getAllReservations();

    expect(actual).toEqual([someReservation, someOtherReservation]);
    expect(getAllElementsMock).toBeCalledTimes(1);
  });
});

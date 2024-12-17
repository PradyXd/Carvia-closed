import { getCars, createCar } from "../src/services/hygraph";

describe("Hygraph Service Tests", () => {
  test("Fetch cars from Hygraph", async () => {
    const cars = await getCars();
    expect(cars).toBeDefined();
    expect(Array.isArray(cars)).toBe(true);
  });

  test("Create car in Hygraph", async () => {
    const carData = {
      brand: "Hyundai",
      model: "Creta",
      price: 1200000,
      fuelType: "Petrol",
      status: "Available",
      image: "image-url",
      dealershipId: "dealership-id",
    };
    const car = await createCar(carData);
    expect(car).toHaveProperty("id");
  });
});

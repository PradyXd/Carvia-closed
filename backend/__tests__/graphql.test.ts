import request from "supertest";
import { app } from "../src/index";
import { carSchema } from "../src/schemas/carSchema";
import carResolver from "../src/resolvers/carresolver";

test("Fetch all cars", async () => {
  const response = await request(app).post("/").send({
    query: `
      query {
        getCars {
          id
          brand
          model
        }
      }
    `,
  });
  expect(response.body.data.getCars).toBeDefined();
});

test("Add a new car", async () => {
  const response = await request(app).post("/").send({
    query: `
      mutation {
        createCar(
          brand: "Honda"
          model: "City"
          price: 1100000
          fuelType: "Petrol"
          status: "Available"
          image: "image-url"
          dealershipId: "dealership-id"
        ) {
          id
        }
      }
    `,
  });
  expect(response.body.data.createCar.id).toBeDefined();
});

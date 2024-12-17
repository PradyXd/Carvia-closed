import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT!;
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN!;

const apiClient = axios.create({
  baseURL: HYGRAPH_ENDPOINT,
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`,
  },
});

export interface CarData {
  brand: string;
  model: string;
  price: number;
  fuelType: string;
  status: string;
  image: string;
  dealershipId: string;
}

interface Car extends CarData {
  id: string;
  dealership: Dealership;
}

interface Dealership {
  id: string;
  name: string;
  location: string;
  contactInfo: Record<string, any>;
}

export const getCars = async () => {
  const query = `
    query {
      cars {
        id
        brand
        model
        price
        fuelType
        status
        image {
          url
        }
        dealership {
          id
          name
          location
          contactInfo
        }
      }
    }
  `;
  const response = await apiClient.post("", { query });
  return response.data.data.cars;
};

export const createCar = async (carData: CarData): Promise<Car> => {
  const mutation = `
    mutation ($brand: String!, $model: String!, $price: Float!, $fuelType: String!, $status: String!, $image: String!, $dealershipId: ID!) {
      createCar(
        data: {
          brand: $brand
          model: $model
          price: $price
          fuelType: $fuelType
          status: $status
          image: { connect: { url: $image } }
          dealership: { connect: { id: $dealershipId } }
        }
      ) {
        id
      }
    }
  `;
  const variables = { ...carData };
  try {
    const response = await apiClient.post("", { query: mutation, variables });
    return response.data.data.createCar;
  } catch (error: any) {
    console.error("Error creating car:", error.response ? error.response.data : error.message);
    throw error; // Rethrow the error after logging
  }
};

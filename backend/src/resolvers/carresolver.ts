import { ApolloError } from 'apollo-server-express';
import { getCars, createCar, CarData } from "../services/hygraph";
import { JSONScalar } from '../schemas/carSchema';

const carResolver = {
  JSON: JSONScalar,
  Query: {
    getCars: async () => {
      try {
        return await getCars();
      } catch (error) {
        throw new ApolloError('Failed to fetch cars', 'FETCH_ERROR');
      }
    },
    getCarById: async (_: any, { id }: { id: string }) => {
      try {
        const cars = await getCars();
        const car = cars.find((car: any) => car.id === id);
        if (!car) {
          throw new ApolloError('Car not found', 'NOT_FOUND');
        }
        return car;
      } catch (error) {
        throw new ApolloError('Failed to fetch car', 'FETCH_ERROR');
      }
    },
  },
  Mutation: {
    createCar: async (_: any, args: CarData) => {
      try {
        return await createCar(args);
      } catch (error) {
        throw new ApolloError('Failed to create car', 'CREATE_ERROR');
      }
    },
  },
};

export default carResolver;

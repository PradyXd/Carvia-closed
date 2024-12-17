import { gql } from "apollo-server";
import { GraphQLScalarType, ValueNode } from 'graphql';

const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'A JSON object',
  parseValue(value) {
    return value; // value from the client
  },
  serialize(value) {
    return value; // value sent to the client
  },
  parseLiteral: (ast: ValueNode) => {
    switch (ast.kind) {
      case 'StringValue':
      case 'IntValue':
      case 'FloatValue':
      case 'BooleanValue':
        return ast.value; // Handle primitive types
      case 'ObjectValue':
        return ast.fields.reduce((obj: Record<string, any>, field) => {
          obj[field.name.value] = JSONScalar.parseLiteral(field.value);
          return obj;
        }, {});
      default:
        return null; // Return null for unsupported types
    }
  },
});

const carSchema = gql`
  scalar JSON

  enum FuelType {
    PETROL
    DIESEL
    ELECTRIC
    HYBRID
  }

  enum CarStatus {
    AVAILABLE
    SOLD
    MAINTENANCE
  }

  input CreateCarInput {
    brand: String!
    model: String!
    price: Float!
    fuelType: FuelType!
    status: CarStatus!
    image: String!
    dealershipId: ID!
  }

  type Car {
    id: ID!
    brand: String!
    model: String!
    price: Float!
    fuelType: FuelType!
    status: CarStatus!
    image: String!
    dealership: Dealership!
    createdAt: String!
    updatedAt: String!
  }

  type Dealership {
    id: ID!
    name: String!
    location: String!
    contactInfo: JSON
  }

  type Query {
    getCars: [Car!]!
    getCarById(id: ID!): Car
  }

  type Mutation {
    createCar(
      brand: String!
      model: String!
      price: Float!
      fuelType: String!
      status: String!
      image: String!
      dealershipId: ID!
    ): Car!
  }
`;

export { carSchema, JSONScalar };

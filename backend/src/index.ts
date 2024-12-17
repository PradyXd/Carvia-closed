import express, { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { carSchema } from './schemas/carSchema';
import carResolver from './resolvers/carresolver';
import dotenv from 'dotenv';
import { stringify } from 'flatted';
import { config } from 'dotenv';

config();

const app = express();

const requiredEnvVars = ['HYGRAPH_ENDPOINT', 'HYGRAPH_TOKEN', 'PORT'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const server = new ApolloServer({
  typeDefs: [carSchema],
  resolvers: [carResolver],
  formatError: (error) => {
    return {
      message: error.message,
      stack: stringify(error.stack),
    };
  },
});

// Start the server and apply middleware
server.start().then(() => {
  app.use('/graphql', server.getMiddleware() as unknown as express.RequestHandler);

  app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}/graphql`);
  });
});

// Export the server for testing
export { server, app }; // Export the server and app

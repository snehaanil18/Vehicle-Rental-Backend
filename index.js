import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();

import userMigrations from './Config/Migrations/userMigration.js'
import vehicleMigrations from './Config/Migrations/Manufacturer/vehicleMigration.js';
import seedData from './Config/Migrations/Manufacturer/seedData.js'

import { ApolloServer } from 'apollo-server-express'
import schema from './graphql/schema.js';
import { graphqlUploadExpress} from 'graphql-upload';


const app = express();

// Middleware to parse JSON data
app.use(express.json());
app.use(cors())
// app.use(cors({
//   origin: 'http://localhost:3000', // Frontend URL
//   credentials: true, // Include credentials like cookies 
// }));

app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); 

const PORT = process.env.PORT || 4000;
                                                                                                                                            
// Creae an instance of ApolloServer
// const server = new ApolloServer({
//     schema, // Use the schema created by makeExecutableSchema
//     introspection: true,  // Enable GraphQL Playground
//     playground: true,
//   });

const server = new ApolloServer({
  schema,
  uploads: false,
});

// Start the Apollo Server and apply middleware
const startServer = async () => {
  await server.start();  // Wait for the server to start
  server.applyMiddleware({ app, path: '/graphql' });  // Apply the middleware to your Express app

  // Run migrations before starting the server
  await userMigrations();
  await vehicleMigrations(); // Run vehicle migrations
  await seedData(); // Seed the data
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`); // Uncomment to log the endpoint
  });
};

// Call the async function to start the server
startServer().catch(err => console.error('Server error:', err));
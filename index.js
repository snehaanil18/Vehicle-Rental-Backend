import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import session from 'express-session';
import http from 'http';
import { createSocketServer } from './Config/Websocket/webSocketServer.js';
dotenv.config();

import userMigrations from './Config/Migrations/userMigration.js'
import vehicleMigrations from './Config/Migrations/Manufacturer/vehicleMigration.js';
import seedData from './Config/Migrations/Manufacturer/seedData.js'

import { ApolloServer } from 'apollo-server-express'
import schema from './graphql/schema.js';
import { graphqlUploadExpress} from 'graphql-upload';

import createTypesenseCollection from './Config/Typesense/vehicleSchema.js'
import jwt from 'jsonwebtoken';


const app = express();
const httpServer = http.createServer(app); 
const io = createSocketServer(httpServer);


createTypesenseCollection();
// Middleware to parse JSON data
app.use(express.json());
// app.use(cors())
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];



app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) { 
      callback(null, true);
    } else {      
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


// Session middleware for development
app.use(session({
  secret: 'your_secret_key', 
  resave: false, 
  saveUninitialized: true, 
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  }
}));


app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); 

const PORT = process.env.PORT || 4000;
                                                                                                                                            


// Apollo Server setup
const server = new ApolloServer({
  schema,
  context: ({ req, res }) => {
    // Get the token from the Authorization header
    const token = req.headers.authorization || '';

    let userId = null;
    if (token) {
      try {
        // Verify the token and extract the userId
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        userId = decoded.userId; // Extract userId from the decoded payload
      } catch (err) {
        console.error('Token verification failed:', err);
      }
    }

    // Return the context with req, res, and userId
    return {
      req,
      res,
      io,
      userId, // Include userId in the context
    };
  },
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

  httpServer.listen(PORT, () => { // Using httpServer.listen here
    console.log(`HServer running on port ${PORT}`);
    console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
  })
  
  // app.listen(PORT, () => {
  //   console.log(`Server running on port ${PORT}`);
  //   console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`); 
  // });
};

// Call the async function to start the server
startServer().catch(err => console.error('Server error:', err));
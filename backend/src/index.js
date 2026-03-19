const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs } = require('./graphql/schema');
const { resolvers } = require('./graphql/resolvers');
const { getUserFromToken } = require('./utils/auth');
const { port, mongoUri, corsOrigin } = require('./config');

async function startServer() {
  const app = express();

  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${mongoUri}`);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
  });

  await apolloServer.start();

  app.use('/graphql', cors({ origin: corsOrigin }), express.json(), expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const user = getUserFromToken(authHeader);
      return { user };
    }
  }));

  app.get('/', (_, res) => {
    res.json({
      message: 'COMP3133 Assignment 2 backend is running',
      graphql: '/graphql'
    });
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/graphql`);
  });
}

startServer().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});

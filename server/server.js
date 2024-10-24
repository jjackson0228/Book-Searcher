const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { ApolloServer } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('schemas');

const app = express();
const PORT = process.env.PORT || 3001;

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({ user: authMiddleware(req) }), // Add authentication to context
});

// Start Apollo Server and apply middleware
async function startApolloServer() {
  await server.start();
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({ user: authMiddleware(req) }),
    })
  );

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  // Connect to MongoDB and start the server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on http://localhost:${PORT}`);
      console.log(
        `🚀 GraphQL server ready at http://localhost:${PORT}/graphql`
      );
    });
  });
}
// Initialize the Apollo Server
startApolloServer().catch((error) =>
  console.error('Error starting server:', error)
);

const typeDefs = `
# Book Type: Represents a book with relevant properties

type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
}

# User Type: Represents a user with saved books
type User {
  _id: ID!
  username: String!
  email: String!
  bookCount: Int
  savedBooks: [Book]
}

# Auth Type: Represents authentication data
type Auth {
  token: ID!
  user: User
}

# Input Type: Used to pass book data to saveBook mutation
input BookInput {
  bookId: String!
  authors: [String]
  description: String
  title: String
  image: String
  link: String
}

# Query Type: Allows fetching the current user’s data
type Query {
  me: User
}

# Mutation Type: Handles user operations and saving/removing books
type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  saveBook(bookData: BookInput!): User
  removeBook(bookId: String!): User
}
`;

module.exports = typeDefs;
